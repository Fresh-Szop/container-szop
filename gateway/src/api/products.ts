import bt from "@/common/base-types.js"
import rt from "@/common/response-types.js"
import $ from "@/env/env.js"
import api from "@/libs/utils/api.js"
import O from "@/libs/utils/Objects.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { StatusCode } from "hono/utils/http-status"
import { z } from "zod"

const productsRoutes = new Hono()
export default productsRoutes

productsRoutes.get(
	"/products",
	zValidator(
		"header",
		z.object({
			"x-timetravel-month": z.coerce
				.number()
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
			order: z.enum([
				"availability-asc", "availability-desc",
				"name-asc", "name-desc",
				"price-asc", "price-desc",
			])
				.optional()
				.default("name-asc"),
			isSeason: z.enum(["true", "false"])
				.transform(v => v === "true")
				.optional(),
			category: z.enum(["vegetable", "fruit", "ingredients"])
				.optional(),
			discount: z.enum(["true", "false"])
				.transform(v => v === "true")
				.optional(),
			"price-min": z.coerce
				.number()
				.gte(0.01)
				.optional(),
			"price-max": z.coerce
				.number()
				.gte(0.01)
				.optional(),
		}),
	),
	async c => {
		const query = new URLSearchParams(Object.entries(c.req.query()))

		const productRes = await fetch(api($.WAREHOUSE)`products?${query}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (productRes.status != sc.success.ok) {
			return c.text(await productRes.text(), productRes.status as StatusCode)
		}

		const productPages: {
			products: rt.FullProduct[],
			pages: bt.PageCursor,
		} = await productRes.json()

		const user = c.get("auth-user")
		if (!user) {
			return c.json(productPages)
		}

		const { basket }: {
			basket: bt.BasketEntry[]
		} = await fetch(api($.STORE)`basket`, {
			method: "GET",
			headers: c.req.header(),
		}).then(r => r.json())

		if (basket.length == 0) {
			return c.json(productPages)
		}

		const { products, pages } = productPages
		return c.json({
			products: products.map(p => ({
				...p,
				basketQuantity: basket.find(b => b.productId === p.productId)?.quantity
			})),
			pages,
		})
	}
)

productsRoutes.get(
	"/products/:productId",
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
	async c => {
		const productRes = await fetch(api($.WAREHOUSE)`products/${c.req.valid("param").productId}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (productRes.status != sc.success.ok) {
			return c.text(await productRes.text(), productRes.status as StatusCode)
		}

		const product: rt.FullProduct = await productRes.json()

		const user = c.get("auth-user")
		if (!user) {
			return c.json(product)
		}

		const { basket }: {
			basket: bt.BasketEntry[]
		} = await fetch(api($.STORE)`basket`, {
			method: "GET",
			headers: c.req.header(),
		}).then(r => r.json())

		if (basket.length == 0) {
			return c.json(product)
		}

		const basketQuantity = basket.find(b => b.productId === product.productId)?.productId
		return c.json({
			...product,
			basketQuantity,
		})
	}
)

// productsRoutes.patch(
// 	"/products/:productId/$",
// 	zValidator(
// 		"param",
// 		z.object({
// 			productId: z.coerce
// 				.number()
// 				.int()
// 				.gte(1),
// 		}),
// 	),
// 	zValidator(
// 		"json",
// 		z.object({
// 			addedUnits: z.number()
// 				.int()
// 			.gte(1),
// 		}),
// 	),
// 	async c => {
// 		const productId = c.req.valid("param").productId
// 		const addedUnits = c.req.valid("json").addedUnits

// 		const productExists = await repo.Products.exists(productId)

// 		if (!productExists) {
// 			return c.text(
// 				`Did not found product with id [${productId}].`,
// 				sc.error.notFound,
// 			)
// 		}

// 		const product = await repo.Products.updateAvailability(productId, { addedUnits })

// 		return c.json(product)
// 	}
// )
