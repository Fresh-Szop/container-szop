import bt from "@/common/base-types.js"
import rt from "@/common/response-types.js"
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

const subscriptionRoutes = new Hono()
export default subscriptionRoutes


subscriptionRoutes.post(
	"/subscriptions",
	requireAuth(),
	async c => {
		const subscriptionRes = await fetch(api($.STORE)`subscriptions`, {
			method: "POST",
			headers: c.req.header(),
		})

		return c.json(await subscriptionRes.json(), subscriptionRes.status as StatusCode)
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
			.transform(v => v as bt.months),
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
		const query = new URLSearchParams(Object.entries(c.req.valid("query"))
			.map(([k, v]) => [k, v.toString()]))

		const subscriptionRes = await fetch(api($.STORE)`subscriptions?${query}`, {
			method: "GET",
			headers: c.req.header(),
		})

		return c.json(await subscriptionRes.json(), subscriptionRes.status as StatusCode)
	},
)


// subscriptionRoutes.get(
// 	"/subscriptions/$",
// 	async c => {
// 		const subscriptions = await repo.Subscriptions.$.selectAll()

// 		return c.json(subscriptions)
// 	},
// )

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
			.transform(v => v as bt.months),
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
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionRes = await fetch(api($.STORE)`subscriptions/${subscriptionId}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (subscriptionRes.status != sc.success.ok) {
			return c.text(await subscriptionRes.text(), subscriptionRes.status as StatusCode)
		}

		const { subscription, subscriptionProducts }: {
			subscription: bt.Subscription,
			subscriptionProducts: bt.SubscriptionProduct[],
		} = await subscriptionRes.json()

		const retrievedProducts = await Promise.all(
			subscriptionProducts.map(p => fetch(api($.WAREHOUSE)`products/${p.productId}`, {
				headers: O.without(c.req.header(), ["content-length"])
			}).then(r => r.json())
			)) as rt.FullProduct[]
		
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
			.transform(v => v as bt.months),
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
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionRes = await fetch(api($.STORE)`subscriptions/${subscriptionId}`, {
			method: "GET",
			headers: c.req.header(),
			body: JSON.stringify(c.req.valid("json"))
		})

		if (subscriptionRes.status != sc.success.ok) {
			return c.text(await subscriptionRes.text(), subscriptionRes.status as StatusCode)
		}

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
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionRes = await fetch(api($.STORE)`subscriptions/${subscriptionId}`, {
			method: "DELETE",
			headers: c.req.header(),
		})

		if (subscriptionRes.status != sc.success.noContent) {
			return c.text(await subscriptionRes.text(), subscriptionRes.status as StatusCode)
		}

		return c.body(
			null,
			sc.success.noContent,
		)
	},
)

// subscriptionRoutes.post(
// 	"/subscriptions/:subscriptionId/$",
// 	zValidator(
// 		"param",
// 		z.object({
// 			subscriptionId: z.coerce
// 				.number()
// 				.int()
// 				.gte(1),
// 		}),
// 	),
// 	zValidator("header", z.object({
// 		"x-timetravel-month": z.coerce
// 			.number()
// 			.gte(1)
// 			.lte(12)
// 			.optional()
// 			.default(new Date().getMonth() + 1)
// 			.transform(v => v as months),
// 	})),
// 	async c => {
// 		const subscriptionId = c.req.valid("param").subscriptionId
// 		const headers = c.req.valid("header")

// 		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

// 		if (!subscriptionExists) {
// 			return c.text(
// 				`Did not found subscription with name [${subscriptionId}].`,
// 				sc.error.notFound,
// 			)
// 		}

// 		const [subscription, subscriptionProducts] = await repo.Subscriptions.select(subscriptionId)

// 		if (!subscription.addressName) {
// 			return c.text(
// 				pack`Cannot emit order from subscription with id [${subscriptionId}]:
// 				missing address.`,
// 				sc.error.badRequest,
// 			)
// 		}

// 		if (subscription.status === "paused") {
// 			return c.text(
// 				pack`Cannot emit order from subscription with id [${subscriptionId}]:
// 				subscription paused.`,
// 				sc.error.badRequest,
// 			)
// 		}

// 		const products = await repo.Products.selectAll(
// 			subscriptionProducts.map(b => b.productId),
// 			headers["x-timetravel-month"],
// 		)
// 			.then(ps => ps.map(p => {
// 				const quantity = O.require(
// 					subscriptionProducts.find(b => b.productId === p.productId)
// 				).quantity

// 				return {
// 					...p,
// 					quantity,
// 					finalBasePrice: quantity * p.basePrice,
// 					finalDiscountedPrice: quantity * (p.discountedPrice ?? p.basePrice),
// 				}
// 			})
// 				.filter(p => p.quantity > 0)
// 		)

// 		const productQuantities = products.map(p => ({
// 			productId: p.productId,
// 			expectedQuantity: O.require(subscriptionProducts.find(b => b.productId === p.productId)).quantity,
// 			availableQuantity: p.availableUnits,
// 		})).map(p => ({
// 			...p,
// 			actualQuantity: Math.min(p.availableQuantity, p.expectedQuantity),
// 		}))

// 		const allegedConflicts = productQuantities.filter(q =>
// 			q.expectedQuantity !== q.actualQuantity
// 		)
// 		const conflicts = allegedConflicts.length ? allegedConflicts : undefined

// 		if (!conflicts) {
// 			await Promise.all(products.map(p => repo.Products.updateAvailability(
// 				p.productId,
// 				{ removedUnits: p.quantity }
// 			)))
// 		}

// 		const address = O.require(await repo.Addresses.select(
// 			subscription.userId,
// 			subscription.addressName,
// 		))

// 		const orderId = await repo.Orders.create({
// 			...address,
// 			userId: subscription.userId,
// 		}, products, conflicts)

// 		return c.json({
// 			orderId,
// 			conflicts,
// 		}, conflicts ? sc.error.conflict :  sc.success.created)
// 	},
// )
