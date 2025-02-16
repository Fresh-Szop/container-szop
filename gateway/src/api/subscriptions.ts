import { months } from "@/drizzle/db.js"
import repo from "@/drizzle/repository.js"
import O from "@/libs/utils/Objects.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const subscriptionRoutes = new Hono()
export default subscriptionRoutes


subscriptionRoutes.post(
	"/subscriptions",
	requireAuth(),
	async c => {
		const userId = O.require(c.get("auth-user"))

		const basket = await repo.Basket.select(userId)

		await repo.Basket.clear(userId)

		const subscriptionId = await repo.Subscriptions.create(
			userId,
			basket,
		)

		return c.json({
			subscriptionId,
		}, sc.success.created)
	},
)

subscriptionRoutes.get(
	"/subscriptions",
	requireAuth(),
	zValidator("header", z.object({
		"x-timetravel-month": z.coerce
			.number()
			.gte(1)
			.lte(12)
			.optional()
			.default(new Date().getMonth() + 1)
			.transform(v => v as months),
	})),
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
		status: z.enum(["active", "paused"])
			.optional(),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const headers = c.req.valid("header")
		const query = {
			...c.req.valid("query"),
			pageSize: c.req.valid("query")["page-size"],
			userId,
		}

		const rowsCnt = await repo.Subscriptions.count({ filters: query })

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

		const [simpleSubscriptions, subscriptionsProducts] = await repo.Subscriptions.selectPageWhen({
			filters: query,
			pageRequest: query,
		})

		const productIds = new Set(subscriptionsProducts.map(sp => sp.productId))

		const products = await repo.Products.selectAll(
			Array.from(productIds),
			headers["x-timetravel-month"],
		)

		const subscriptionsWithPrices = subscriptionsProducts.map(s => {
			const product = O.require(products.find(p => p.productId === s.productId))
			const finalPrice = product.discountedPrice ?? product.basePrice
			return {
				subscriptionId: s.subscriptionId,
				finalDiscountedPrice: finalPrice * s.quantity,
			}
		})

		const aggregatedSubscriptions = subscriptionsWithPrices.reduce((acc, s) => {
			const es = acc.get(s.subscriptionId) ?? {
				subscriptionId: s.subscriptionId,
				finalDiscountedPrice: 0,
			}
			es.finalDiscountedPrice += s.finalDiscountedPrice
			acc.set(s.subscriptionId, es)
			return acc
		}, new Map<number, typeof subscriptionsWithPrices[0]>())

		return c.json({
			subscriptions: simpleSubscriptions.map(s => ({
				...s,
				finalDiscountedPrice: aggregatedSubscriptions.get(s.subscriptionId)
					?.finalDiscountedPrice ?? 0,
			})),
			pages,
		})
	},
)


subscriptionRoutes.get(
	"/subscriptions/$",
	async c => {
		const subscriptions = await repo.Subscriptions.$.selectAll()

		return c.json(subscriptions)
	},
)

subscriptionRoutes.get(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator("header", z.object({
		"x-timetravel-month": z.coerce
			.number()
			.gte(1)
			.lte(12)
			.optional()
			.default(new Date().getMonth() + 1)
			.transform(v => v as months),
	})),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const headers = c.req.valid("header")
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with id [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, subscriptionProducts] = await repo.Subscriptions.select(subscriptionId)

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		const retrievedProducts = await repo.Products.selectAll(
			subscriptionProducts.map(p => p.productId),
			headers["x-timetravel-month"],
		)

		const products = retrievedProducts.map(p => {
			const quantity = O.require(
				subscriptionProducts.find(sp => sp.productId === p.productId)?.quantity
			)
			return {
				...p,
				basketQuantity: quantity,
				finalBasePrice: p.basePrice * quantity,
				finalDiscountedPrice: (p.discountedPrice ?? p.basePrice) * quantity,
			}
		})

		const [finalBasePrice, finalDiscountedPrice] = products.reduce(([fbp, fdp], p) => [
			fbp + p.finalBasePrice,
			fdp + p.finalDiscountedPrice,
		], [0, 0] as [number, number])

		return c.json({
			...subscription,
			finalBasePrice,
			finalDiscountedPrice,
			products,
		})
	},
)

subscriptionRoutes.patch(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator("header", z.object({
		"x-timetravel-month": z.coerce
			.number()
			.gte(1)
			.lte(12)
			.optional()
			.default(new Date().getMonth() + 1)
			.transform(v => v as months),
	})),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator("json", z.object({
		status: z.enum(["active", "paused"])
			.optional(),
		addressName: z.string()
			.refine(...z_notBlank("addressName"))
			.optional(),
		frequency: z.number()
			.int()
			.min(1)
			.max(12)
			.optional(),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const subscriptionId = c.req.valid("param").subscriptionId
		const headers = c.req.valid("header")
		const query = c.req.valid("json")


		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with name [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, _] = O.require(await repo.Subscriptions.select(subscriptionId))

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		if (query.addressName) {
			const addressExists = await repo.Addresses.exists(userId, query.addressName)

			if (!addressExists) {
				return c.text(
					`Did not found address with name [${query.addressName}].`,
					sc.error.notFound,
				)
			}
		}

		await repo.Subscriptions.updateData(
			subscriptionId,
			query,
		)

		return c.redirect(
			`/subscriptions/${subscriptionId}`,
			sc.redirect.seeOther,
		)
	},
)

subscriptionRoutes.delete(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with name [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, _] = O.require(await repo.Subscriptions.select(subscriptionId))

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		await repo.Subscriptions.delete(subscriptionId)

		return c.body(null, sc.success.noContent)
	},
)

subscriptionRoutes.post(
	"/subscriptions/:subscriptionId/$",
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator("header", z.object({
		"x-timetravel-month": z.coerce
			.number()
			.gte(1)
			.lte(12)
			.optional()
			.default(new Date().getMonth() + 1)
			.transform(v => v as months),
	})),
	async c => {
		const subscriptionId = c.req.valid("param").subscriptionId
		const headers = c.req.valid("header")

		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with name [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, subscriptionProducts] = await repo.Subscriptions.select(subscriptionId)

		if (!subscription.addressName) {
			return c.text(
				pack`Cannot emit order from subscription with id [${subscriptionId}]:
				missing address.`,
				sc.error.badRequest,
			)
		}

		if (subscription.status === "paused") {
			return c.text(
				pack`Cannot emit order from subscription with id [${subscriptionId}]:
				subscription paused.`,
				sc.error.badRequest,
			)
		}

		const products = await repo.Products.selectAll(
			subscriptionProducts.map(b => b.productId),
			headers["x-timetravel-month"],
		)
			.then(ps => ps.map(p => {
				const quantity = O.require(
					subscriptionProducts.find(b => b.productId === p.productId)
				).quantity

				return {
					...p,
					quantity,
					finalBasePrice: quantity * p.basePrice,
					finalDiscountedPrice: quantity * (p.discountedPrice ?? p.basePrice),
				}
			})
				.filter(p => p.quantity > 0)
		)

		const productQuantities = products.map(p => ({
			productId: p.productId,
			expectedQuantity: O.require(subscriptionProducts.find(b => b.productId === p.productId)).quantity,
			availableQuantity: p.availableUnits,
		})).map(p => ({
			...p,
			actualQuantity: Math.min(p.availableQuantity, p.expectedQuantity),
		}))

		const allegedConflicts = productQuantities.filter(q =>
			q.expectedQuantity !== q.actualQuantity
		)
		const conflicts = allegedConflicts.length ? allegedConflicts : undefined

		if (!conflicts) {
			await Promise.all(products.map(p => repo.Products.updateAvailability(
				p.productId,
				{ removedUnits: p.quantity }
			)))
		}

		const address = O.require(await repo.Addresses.select(
			subscription.userId,
			subscription.addressName,
		))

		const orderId = await repo.Orders.create({
			...address,
			userId: subscription.userId,
		}, products, conflicts)

		return c.json({
			orderId,
			conflicts,
		}, conflicts ? sc.error.conflict :  sc.success.created)
	},
)
