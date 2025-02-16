import bt from "@/common/base-types.js"
import repo from "@/drizzle/repository.js"
import { allowedPhonePrefixes } from "@/libs/utils/formatPhoneNumber.js"
import O from "@/libs/utils/Objects.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import cors from "@/middleware/cors.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const ordersRoutes = new Hono()
export default ordersRoutes

ordersRoutes.post(
	"/orders",
	cors.internal(),
	requireAuth(),
	zValidator("header", z.object({
		"x-timetravel-month": z.coerce
			.number()
			.gte(1)
			.lte(12)
			.optional()
			.default(new Date().getMonth() + 1)
			.transform(v => v as bt.months),
	})),
	zValidator("json", z.object({
		address: z.object({
			addressName: z.string()
				.refine(...z_notBlank("addressName")),
			firstName: z.string()
				.refine(...z_notBlank("firstName")),
			lastName: z.string()
				.refine(...z_notBlank("lastName")),
			firstAddressLine: z.string()
				.refine(...z_notBlank("firstAddressLine")),
			secondAddressLine: z.string()
				.nullable()
				.optional(),
			postalCode: z.string()
				.refine(v => /\d{2}-\d{3}/.test(v), { message: "Invalid postalCode format" }),
			postalCity: z.string()
				.refine(...z_notBlank("postalCity")),
			phoneNumber: z.string()
				.refine(v => /\d{9}/.test(v), { message: "Invalid phoneNumber format" })
				.refine(
					v => allowedPhonePrefixes.includes(v.substring(0, 2)),
					v => ({
						message: `Invalid phone number starting with ${v.substring(0, 2)}`
					})
				),
		}),
		basket: z.array(z.object({
			userId: z.string(),
			productId: z.number()
				.int(),
			quantity: z.number()
				.int(),
		})),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const address = c.req.valid("json").address
		const basket = c.req.valid("json").basket
		const headers = c.req.valid("header")

		const products = await repo.Products.selectAll(
			basket.map(b => b.productId),
			headers["x-timetravel-month"],
		)
			.then(ps => ps.map(p => {
				const quantity = O.require(
					basket.find(b => b.productId === p.productId)
				).quantity

				return {
					...p,
					quantity,
					discountedPrice: p.discountedPrice ?? p.basePrice,
					finalBasePrice: quantity * p.basePrice,
					finalDiscountedPrice: quantity * (p.discountedPrice ?? p.basePrice),
				}
			})
				.filter(p => p.quantity > 0)
		)
		
		const productQuantities = products.map(p => ({
			productId: p.productId,
			expectedBasketQuantity: O.require(products.find(b => b.productId === p.productId)).quantity,
			availableQuantity: p.availableUnits,
		})).map(p => ({
			...p,
			actualBasketQuantity: Math.min(p.availableQuantity, p.expectedBasketQuantity),
		}))

		const conflicts = productQuantities.filter(q =>
			q.expectedBasketQuantity !== q.actualBasketQuantity
		)

		if (conflicts.length) {
			return c.json({
				conflicts,
			}, sc.error.conflict)
		}

		await Promise.all(products.map(p => repo.Products.updateAvailability(
			p.productId,
			{ removedUnits: p.quantity }
		)))

		const orderId = await repo.Orders.create({
			...address,
			userId,
		}, products)

		return c.json({
			orderId
		}, sc.success.created)
	},
)

ordersRoutes.get(
	"/orders",
	cors.public(),
	requireAuth(),
	zValidator("query", z.object({
		page: z.coerce
			.number()
			.gte(1)
			.optional()
			.default(1),
		"page-size": z.coerce
			.number()
			.gte(5)
			.lte(90)
			.optional()
			.default(10),
		status: z.enum(["rejected", "delivered", "sent", "preparing", "placed"])
			.optional(),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const query = {
			...c.req.valid("query"),
			pageSize: c.req.valid("query")["page-size"],
			userId,
		}

		const rowsCnt = await repo.Orders.count({
			filters: query,
		})

		const firstPage = rowsCnt ? 1 : 0
		const lastPage = Math.ceil(rowsCnt ? rowsCnt / query.pageSize : 0)

		if (firstPage && lastPage && query.page > lastPage
			|| firstPage === 0 && query.page > 1
		) {
			return c.text(
				pack`Requested page outside of available data.
				Requested [${query.page}], available [${firstPage}]..[${lastPage}].`,
				sc.error.unprocessableContent,
			)
		}

		const pages = {
			firstPage,
			currentPage: query.page,
			lastPage,
		}

		const orders = await repo.Orders.selectPageWhen({
			filters: query,
			pageRequest: query,
		})

		return c.json({
			orders,
			pages,
		})
	},
)

ordersRoutes.get(
	"/orders/$",
	cors.internal(),
	async c => {
		const orders = await repo.Orders.$.selectAll()

		return c.json(orders)
	},
)

ordersRoutes.get(
	"/orders/:orderId",
	cors.public(),
	requireAuth(),
	zValidator("param", z.object({
		orderId: z.coerce
			.number()
			.int()
			.gte(1),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const orderId = c.req.valid("param").orderId

		const orderExists = await repo.Orders.exists(orderId)

		if (!orderExists) {
			return c.text(
				`Did not found order with name [${orderId}].`,
				sc.error.notFound,
			)
		}

		const order = O.require(await repo.Orders.select(orderId))

		if (order.userId !== userId) {
			return c.text(
				`Order with id [${orderId}] does not belong to user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		return c.json(order)
	},
)

ordersRoutes.patch(
	"/orders/:orderId/$",
	cors.internal(),
	zValidator("param", z.object({
		orderId: z.coerce
			.number()
			.int()
			.gte(1),
	})),
	zValidator("json", z.object({
		status: z.enum(["delivered", "sent", "preparing"]),
	})),
	async c => {
		const orderId = c.req.valid("param").orderId
		const status = c.req.valid("json").status

		const orderExists = await repo.Orders.exists(orderId)

		if (!orderExists) {
			return c.text(
				`Did not found order with name [${orderExists}].`,
				sc.error.notFound,
			)
		}

		let order = await repo.Orders.select(orderId)
			.then(o => o!)

		if (order.status === "rejected") {
			return c.text(
				`Order with id [${orderId}] is rejected, cannot process further.`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "preparing" && status === "preparing") {
			return c.text(
				`Order with id [${orderId}] is already has status [preparing].`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "sent" && status === "sent") {
			return c.text(
				`Order with id [${orderId}] is already has status [sent].`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "sent" && status === "preparing") {
			return c.text(
				pack`Order with id [${orderId}] is already has status [sent],
				cannot request [preparing].`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "delivered" && status === "delivered") {
			return c.text(
				`Order with id [${orderId}] is already has status [delivered].`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "delivered" && status === "preparing") {
			return c.text(
				pack`Order with id [${orderId}] is already has status [delivered],
				cannot request [preparing].`,
				sc.error.unprocessableContent,
			)
		}

		if (order.status === "delivered" && status === "sent") {
			return c.text(
				pack`Order with id [${orderId}] is already has status [delivered],
				cannot request [sent].`,
				sc.error.unprocessableContent,
			)
		}

		await repo.Orders.$.updateStatus(orderId, status)

		order = await repo.Orders.select(orderId)

		return c.json(order)
	},
)
