import bt from "@/common/base-types.js"
import repo from "@/drizzle/repository.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import cors from "@/middleware/cors.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const productsRoutes = new Hono()
export default productsRoutes

productsRoutes.get(
	"/products",
	cors.public(),
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

		const headers = c.req.valid("header")
		const query = {
			...c.req.valid("query"),
			minPrice: c.req.valid("query")["price-min"],
			maxPrice: c.req.valid("query")["price-max"],
			pageSize: c.req.valid("query")["page-size"],
		}

		if ((query.minPrice ?? 0) >= (query.maxPrice ?? 1e14)) {
			return c.text(
				`Max price must be larger than min price`,
				sc.error.unprocessableContent,
			)
		}

		const rowsCnt = await repo.Products.count({
			filters: query,
			month: headers["x-timetravel-month"],
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

		let products = await repo.Products.selectPageWhen({
			filters: query,
			order: query.order,
			month: headers["x-timetravel-month"],
			pageRequest: query,
		})

		return c.json({
			products,
			pages,
		})
	}
)

productsRoutes.get(
	"/products/:productId",
	cors.public(),
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
		const month = c.req.valid("header")["x-timetravel-month"]
		const productId = c.req.valid("param").productId

		const product = await repo.Products.select(productId, month)

		if (!product) {
			return c.text(
				`Did not found product with id [${productId}].`,
				sc.error.notFound,
			)
		}

		return c.json({
			...product,
		})
	}
)

productsRoutes.patch(
	"/products/:productId/$",
	cors.internal(),
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
		"json",
		z.object({
			addedUnits: z.number()
				.int()
			.gte(1),
		}),
	),
	async c => {
		const productId = c.req.valid("param").productId
		const addedUnits = c.req.valid("json").addedUnits

		const productExists = await repo.Products.exists(productId)

		if (!productExists) {
			return c.text(
				`Did not found product with id [${productId}].`,
				sc.error.notFound,
			)
		}

		const product = await repo.Products.updateAvailability(productId, { addedUnits })

		return c.json(product)
	}
)
