import repo from "@/drizzle/repository.js"
import O from "@/libs/utils/Objects.js"
import sc from "@/libs/utils/status-codes.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const basketsRoutes = new Hono()
export default basketsRoutes

basketsRoutes.get(
	"/basket",
	requireAuth(),
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
		const query = c.req.valid("query")
		const userId = O.require(c.get("auth-user"))

		const basket = await repo.Basket.select(userId)
		if (basket.length === 0) {
			return c.json({ basket: [] })
		}

		return c.json({
			basket
		})
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
		const userId = O.require(c.get("auth-user"))
		const productId = c.req.valid("param").productId
		const quantity = c.req.valid("json").basketQuantity

		await repo.Basket.increaseProduct(userId, productId, quantity)

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
				z.literal(Infinity),
			])
		}),
	),
	async c => {
		console.log(c.req.valid("json"))

		const userId = O.require(c.get("auth-user"))
		const productId = c.req.valid("param").productId
		const quantity = c.req.valid("json").basketQuantity

		await repo.Basket.decreaseProduct(userId, productId, quantity)

		return c.redirect("/basket", sc.redirect.seeOther)
	},
)
