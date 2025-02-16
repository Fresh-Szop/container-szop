import repo from "@/drizzle/repository.js"
import $ from "@/env/env.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import cors from "@/middleware/cors.js"
import { serveStatic } from "@hono/node-server/serve-static"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const recipesRoutes = new Hono()
export default recipesRoutes

recipesRoutes.get(
	"/recipes",
	cors.public(),
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
				"difficulty-asc", "difficulty-desc",
				"name-asc", "name-desc",
			])
				.optional()
				.default("name-asc"),
			category: z.union([
				z.array(
					z.enum(["desserts", "sides", "soups", "meals", "salads"]),
				),
				z.enum(["desserts", "sides", "soups", "meals", "salads"]),
			])
				.optional()
				.transform(c => (
					c === undefined ? [] : typeof c === "string" ? [c] : [...c]
				) as ("desserts" | "sides" | "soups" | "meals" | "salads")[]),
			"difficulty-min": z.enum([
				"1", "2", "3", "4", "5"
			])
				.optional()
				.transform(d => d && +d as 1 | 2 | 3 | 4 | 5),
			"difficulty-max": z.enum([
				"1", "2", "3", "4", "5"
			])
				.optional()
				.transform(d => d && +d as 1 | 2 | 3 | 4 | 5),
		})
	),
	async c => {

		const query = {
			...c.req.valid("query"),
			minDifficulty: c.req.valid("query")["difficulty-min"],
			maxDifficulty: c.req.valid("query")["difficulty-max"],
			pageSize: c.req.valid("query")["page-size"],
		}

		if ((query.minDifficulty ?? 0) > (query.maxDifficulty ?? 6)) {
			return c.text(
				`Max difficulty must be larger or equal to min difficulty`,
				sc.error.unprocessableContent,
			)
		}

		const rowsCnt = await repo.Recipes.count({
			filters: query
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

		const recipes = await repo.Recipes.selectPageWhen({
			filters: query,
			order: query.order,
			pageRequest: query,
		}).then(recipes => recipes.map(r => ({
			...r,
			img: `${$.GATEWAY}/recipes/img/${r.img}`,
		})))

		return c.json({
			recipes,
			pages,
		})
	}
)

recipesRoutes.get(
	"/recipes/:recipeId",
	cors.public(),
	zValidator(
		"param",
		z.object({
			recipeId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	async c => {
		const recipeId = c.req.valid("param").recipeId

		const recipe = await repo.Recipes.select(recipeId)

		if (recipe) {
			return c.json({
				...recipe,
				img: `${$.GATEWAY}/recipes/img/${recipe.img}`,
			})
		} else {
			return c.text(
				`Did not found recipe with id [${recipeId}].`,
				sc.error.notFound,
			)
		}
	},
)

recipesRoutes.get(
	'/recipes/img/*',
	cors.public(),
	serveStatic({
		rewriteRequestPath: url => url.replace(
			/^\/recipes\/img/,
			`${process.env.RESOURCE_URL}/recipes`
		),
	}),
)
