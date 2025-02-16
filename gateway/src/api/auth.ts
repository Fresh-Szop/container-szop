import sc from "@/libs/utils/status-codes.js"
import { requireAuth } from "@/middleware/auth.js"
import { Hono } from "hono"
import { deleteCookie } from "hono/cookie"


const authRoutes = new Hono()
export default authRoutes

authRoutes.delete(
	"/auth",
	requireAuth(),
	async c => {

		deleteCookie(c, "refresh")
		deleteCookie(c, "bearer",)

		return c.json("", sc.success.ok)
	})
