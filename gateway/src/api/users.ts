import $ from "@/env/env.js"
import api from "@/libs/utils/api.js"
import sc from "@/libs/utils/status-codes.js"
import { requireAuth } from "@/middleware/auth.js"
import { Hono } from "hono"
import { StatusCode } from "hono/utils/http-status"

const usersRoutes = new Hono()
export default usersRoutes

usersRoutes.get(
	"/users",
	requireAuth(),
	async c => {
		
		const recipeRes = await fetch(api($.STORE)`users`, {
			headers: c.req.header(),
		})

		if (recipeRes.status != sc.success.ok) {
			return c.text(await recipeRes.text(), recipeRes.status as StatusCode)
		}

		return c.json(await recipeRes.json(), recipeRes.status as StatusCode)
	},
)
