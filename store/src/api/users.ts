import repo from "@/drizzle/repository.js"
import O from "@/libs/utils/Objects.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const usersRoutes = new Hono()
export default usersRoutes

usersRoutes.get(
	"/users",
	requireAuth(),
	async c => {

		const user = await repo.User.select(O.require(c.get("auth-user")))

		return c.json(user)
	},
)

usersRoutes.post(
	"/users",
	zValidator("json", z.object({
		userId: z.string(),
		email: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		picture: z.string(),
	})),
	requireAuth(),
	async c => {
		const user = c.req.valid("json")
		const newUser = await repo.User.upsertAndReturn(user)

		return c.json(newUser)
	},
)
