import O from "@/libs/utils/Objects.js"
import sc from "@/libs/utils/status-codes.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import bt from "@/common/base-types.js"
import api from "@/libs/utils/api.js"
import $ from "@/env/env.js"
import rt from "@/common/response-types.js"
import { StatusCode } from "hono/utils/http-status"

const basketsRoutes = new Hono()
export default basketsRoutes

basketsRoutes.get(
	"/basket",
	requireAuth(),
	zValidator(
		"header",
		z.object({
			"x-timetravel-month": z.coerce
				.number()
				.int()
				.gte(1)
				.lte(12)
				.optional()
				.default(new Date().getMonth() + 1)
				.transform(v => v as bt.months),
		}),
	),
	zValidator(
		"query",
		z.object({
			"omit-listing": z.coerce
				.boolean()
				.optional()
				.default(false)
		}),
	),
	async c => {
		const { basket }: {
			basket: bt.BasketEntry[]
		} = await fetch(api($.STORE)`basket`, {
			method: "GET",
			headers: c.req.header(),
		}).then(r => r.json())

		if (basket.length == 0) {
			return c.json([], sc.success.ok)
		}

		const productIds = new Set(basket.map(b => b.productId))

		const mentionedProducts = await Promise.all(
			productIds.values().map(pid => fetch(api($.WAREHOUSE)`products/${pid}`)
				.then(r => r.json())
				.then(p => p as rt.FullProduct))
		)

		const productQuantities = mentionedProducts.map(p => ({
			productId: p.productId,
			expectedBasketQuantity: O.require(basket.find(b => b.productId === p.productId)).quantity,
			availableQuantity: p.availableUnits,
		})).map(p => ({
			...p,
			actualBasketQuantity: Math.min(p.availableQuantity, p.expectedBasketQuantity),
		}))

		const products = mentionedProducts.map(p => {
			const quantity = O.require(productQuantities.find(q => q.productId === p.productId))
				.actualBasketQuantity

			return {
				...p,
				basketQuantity: quantity,
				finalBasePrice: +(quantity * p.basePrice).toFixed(2),
				finalDiscountedPrice: +(quantity * (p.discountedPrice || p.basePrice)).toFixed(2),
			}
		}).filter(p => p.basketQuantity > 0)

		const summary = products.reduce((p, n) => ({
			basketQuantity: p.basketQuantity + n.basketQuantity,
			finalBasePrice: +(p.finalBasePrice + n.finalBasePrice).toFixed(2),
			finalDiscountedPrice: +(p.finalDiscountedPrice + n.finalDiscountedPrice).toFixed(2),
		}), {
			basketQuantity: 0,
			finalBasePrice: 0,
			finalDiscountedPrice: 0,
		})

		const conflicts = productQuantities.filter(q =>
			q.expectedBasketQuantity !== q.actualBasketQuantity
		)

		if (!conflicts.length) {
			return c.json({
				products,
				summary,
			})
		} else {
			return c.json({
				products,
				summary,
				conflicts,
			}, sc.error.conflict)
		}
	},
)

basketsRoutes.put(
	"/basket/:productId",
	zValidator(
		"param",
		z.object({
			productId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator(
		"header",
		z.object({
			"x-timetravel-month": z.coerce
				.number()
				.int()
				.gte(1)
				.lte(12)
				.optional()
				.default(new Date().getMonth() + 1)
				.transform(v => v as bt.months),
		}),
	),
	zValidator(
		"query",
		z.object({
			"omit-listing": z.coerce
				.boolean()
				.optional()
				.default(false)
		}),
	),
	zValidator(
		"json",
		z.object({
			basketQuantity: z.coerce
				.number()
				.int()
				.min(1)
		}),
	),
	async c => {
		const productId = c.req.valid("param").productId

		const basketRes = await fetch(api($.STORE)`basket/${productId}`, {
			method: "PUT",
			headers: O.without(c.req.header(), ["content-length"]),
			body: JSON.stringify(c.req.valid("json")),
		})

		return c.redirect("/basket", sc.redirect.seeOther)
	},
)

basketsRoutes.delete(
	"/basket/:productId",
	zValidator(
		"param",
		z.object({
			productId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator(
		"header",
		z.object({
			"x-timetravel-month": z.coerce
				.number()
				.int()
				.gte(1)
				.lte(12)
				.optional()
				.default(new Date().getMonth() + 1)
				.transform(v => v as bt.months),
		})
	),
	zValidator(
		"query",
		z.object({
			"omit-listing": z.coerce
				.boolean()
				.optional()
				.default(false)
		}),
	),
	zValidator(
		"json",
		z.object({
			basketQuantity: z.union([
				z.coerce
					.number()
					.int()
					.min(1),
				z.literal(Infinity)
			])
		}),
	),
	async c => {
		const productId = c.req.valid("param").productId

		const basketRes = await fetch(api($.STORE)`basket/${productId}`, {
			method: "DELETE",
			headers: O.without(c.req.header(), ["content-length"]),
			body: JSON.stringify(c.req.valid("json")),
		})

		if (basketRes.status != sc.success.ok) {
			console.log(await basketRes.text())
		}

		return c.redirect("/basket", sc.redirect.seeOther)
	},
)

basketsRoutes.get(
	"/basket/:recipeId",
	zValidator(
		"param",
		z.object({
			recipeId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator(
		"header",
		z.object({
			"x-timetravel-month": z.coerce
				.number()
				.int()
				.gte(1)
				.lte(12)
				.optional()
				.default(new Date().getMonth() + 1)
				.transform(v => v as bt.months),
		})
	),
	async c => {
		const { basket: userBasket }: {
			basket: bt.BasketEntry[]
		} = await fetch(api($.STORE)`basket`, {
			method: "GET",
			headers: c.req.header(),
		}).then(r => r.json())

		if (userBasket.length == 0) {
			return c.json([], sc.success.ok)
		}

		const recipeRes = await fetch(api($.WAREHOUSE)`recipes/${c.req.valid("param").recipeId}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (recipeRes.status != sc.success.ok) {
			return c.text(await recipeRes.text(), recipeRes.status as StatusCode)
		}

		const recipe: rt.Recipe = await recipeRes.json()

		const productIds = new Set(
			recipe.ingredients.map(b => b.productId)
				.filter(p => p != null)
		)

		const mentionedProducts = await Promise.all(
			productIds.values().map(pid => fetch(api($.WAREHOUSE)`products/${pid}`)
				.then(r => r.json())
				.then(p => p as rt.FullProduct))
		)

		const products = mentionedProducts.map(p => ({
			...p,
			basketQuantity: Math.min(
				userBasket.find(bp => bp.productId === p.productId)?.quantity || 0,
				p.availableUnits,
			)
		}))

		return c.json({
			products
		})
	},
)
