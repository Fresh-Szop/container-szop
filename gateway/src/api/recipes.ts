import $ from "@/env/env.js"
import api from "@/libs/utils/api.js"
import sc from "@/libs/utils/status-codes.js"
import { serveStatic } from "@hono/node-server/serve-static"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { StatusCode } from "hono/utils/http-status"
import { z } from "zod"

const recipesRoutes = new Hono()
export default recipesRoutes

recipesRoutes.get(
	"/recipes",
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

		const query = new URLSearchParams(Object.entries(c.req.query()))

		const recipeRes = await fetch(api($.WAREHOUSE)`recipes?${query}`, {
			method: "GET",
			headers: c.req.header(),
		})

		if (recipeRes.status != sc.success.ok) {
			return c.text(await recipeRes.text(), recipeRes.status as StatusCode)
		}
		return c.json(await recipeRes.json(), recipeRes.status as StatusCode)
	}
)

recipesRoutes.get(
	"/recipes/:recipeId",
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
		const recipeRes = await fetch(api($.WAREHOUSE)`recipes/${c.req.param("recipeId")}`, {
			headers: c.req.header(),
		})

		if (recipeRes.status != sc.success.ok) {
			return c.text(await recipeRes.text(), recipeRes.status as StatusCode)
		}

		return c.json(await recipeRes.json(), recipeRes.status as StatusCode)
	},
)

recipesRoutes.get(
	'/recipes/img/:imgId',
	async c => {
		const imgRes = await fetch(api($.WAREHOUSE)`recipes/img/${c.req.param("imgId")}`, {
			headers: c.req.header(),
		})

		if (imgRes.status != sc.success.ok) {
			return c.text(await imgRes.text(), imgRes.status as StatusCode)
		}

		return c.body(await imgRes.arrayBuffer(), imgRes.status as StatusCode)
	}
)
