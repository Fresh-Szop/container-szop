import bt from "@/common/base-types.js"
import $ from "@/env/env.js"
import api from "@/libs/utils/api.js"
import O from "@/libs/utils/Objects.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { StatusCode } from "hono/utils/http-status"
import { z } from "zod"

const ordersRoutes = new Hono()
export default ordersRoutes

ordersRoutes.post(
	"/orders",
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
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	async c => {
		const addressRes = await fetch(api($.STORE)`addresses/${c.req.valid("json").addressName}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (addressRes.status != sc.success.ok) {
			return c.text(await addressRes.text(), addressRes.status as StatusCode)
		}

		const address = await addressRes.json()

		const { basket }: {
			basket: bt.BasketEntry[]
		} = await fetch(api($.STORE)`basket`, {
			method: "GET",
			headers: c.req.header(),
		}).then(r => r.json())

		if (basket.length == 0) {
			return c.text("Basket is empty", sc.error.badRequest)
		}

		const orderRes = await fetch(api($.WAREHOUSE)`orders`, {
			method: "POST",
			headers: O.without(c.req.header(), ["content-length"]),
			body: JSON.stringify({
				address,
				basket,
			})
		})

		if (orderRes.status != sc.success.created) {
			const err = await orderRes.text()
			return c.text(err, orderRes.status as StatusCode)
		}

		console.log(basket)
		await Promise.all(basket.map(b => fetch(api($.STORE)`basket/${b.productId}`, {
			method: "DELETE",
			headers: O.without(c.req.header(), ["content-length"]),
			body: JSON.stringify({ basketQuantity: Number.MAX_SAFE_INTEGER }),
		})))

		const orderNumber = await orderRes.json()

		return c.json(orderNumber, orderRes.status as StatusCode)
	},
)

ordersRoutes.get(
	"/orders",
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
		const ordersRes = await fetch(api($.WAREHOUSE)`orders?${c.req.query()}`, {
			headers: c.req.header(),
		})

		if (ordersRes.status != sc.success.ok) {
			return c.text(await ordersRes.text(), ordersRes.status as StatusCode)
		}

		return c.json(await ordersRes.json(), ordersRes.status as StatusCode)
	},
)

// ordersRoutes.get(
// 	"/orders/$",
// 	async c => {
// 		const orders = await repo.Orders.$.selectAll()

// 		return c.json(orders)
// 	},
// )

ordersRoutes.get(
	"/orders/:orderId",
	requireAuth(),
	zValidator("param", z.object({
		orderId: z.coerce
			.number()
			.int()
			.gte(1),
	})),
	async c => {
		const orderRes = await fetch(api($.WAREHOUSE)`orders/${c.req.param("orderId")}`, {
			headers: c.req.header(),
		})

		if (orderRes.status != sc.success.ok) {
			return c.text(await orderRes.text(), orderRes.status as StatusCode)
		}

		return c.json(await orderRes.json(), orderRes.status as StatusCode)
	},
)

// ordersRoutes.patch(
// 	"/orders/:orderId/$",
// 	zValidator("param", z.object({
// 		orderId: z.coerce
// 			.number()
// 			.int()
// 			.gte(1),
// 	})),
// 	zValidator("json", z.object({
// 		status: z.enum(["delivered", "sent", "preparing"]),
// 	})),
// 	async c => {
// 		const orderId = c.req.valid("param").orderId
// 		const status = c.req.valid("json").status

// 		const orderExists = await repo.Orders.exists(orderId)

// 		if (!orderExists) {
// 			return c.text(
// 				`Did not found order with name [${orderExists}].`,
// 				sc.error.notFound,
// 			)
// 		}

// 		let order = await repo.Orders.select(orderId)
// 			.then(o => o!)

// 		if (order.status === "rejected") {
// 			return c.text(
// 				`Order with id [${orderId}] is rejected, cannot process further.`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "preparing" && status === "preparing") {
// 			return c.text(
// 				`Order with id [${orderId}] is already has status [preparing].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "sent" && status === "sent") {
// 			return c.text(
// 				`Order with id [${orderId}] is already has status [sent].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "sent" && status === "preparing") {
// 			return c.text(
// 				pack`Order with id [${orderId}] is already has status [sent],
// 				cannot request [preparing].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "delivered" && status === "delivered") {
// 			return c.text(
// 				`Order with id [${orderId}] is already has status [delivered].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "delivered" && status === "preparing") {
// 			return c.text(
// 				pack`Order with id [${orderId}] is already has status [delivered],
// 				cannot request [preparing].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		if (order.status === "delivered" && status === "sent") {
// 			return c.text(
// 				pack`Order with id [${orderId}] is already has status [delivered],
// 				cannot request [sent].`,
// 				sc.error.unprocessableContent,
// 			)
// 		}

// 		await repo.Orders.$.updateStatus(orderId, status)

// 		order = await repo.Orders.select(orderId)

// 		return c.json(order)
// 	},
// )
