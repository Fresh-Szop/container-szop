import { getJwtCredentials } from "@/libs/auth/jwt.js"
import tm from "@/libs/utils/time.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { setCookie } from "hono/cookie"
import { z } from "zod"

const debugAuthRoutes = new Hono()
export default debugAuthRoutes

const debugIds = [
	"$__0",
	"$__1",
	"$__2",
	"$__3",
	"$__4",
	"$__5",
	"$__6",
	"$__7",
	"$__8",
	"$__9",
] as const

const randomDebugId = () => debugIds[Math.floor(Math.random() * debugIds.length)]

debugAuthRoutes.get(
	"/auth/$",
	zValidator(
		"query",
		z.object({
			"request-id": z.enum(debugIds)
				.optional()
				.default(randomDebugId),
		})
	),
	async c => {
		const userId = c.req.valid("query")["request-id"]

		const { token, refreshToken } = await getJwtCredentials(
			{ id: userId, role: "user|debug" },
			"--not-google--",
		)

		// Push JWT credentials into cookies
		setCookie(
			c,
			"bearer",
			token,
			{
				maxAge: tm.s.min(59),
				httpOnly: true,
				path: "/"
			}
		)
		setCookie(
			c,
			"refresh",
			refreshToken,
			{
				maxAge: tm.s.min(59) + tm.s.d(7),
				httpOnly: true,
				path: "/"
			}
		)

		// Return user data
		return c.json({
			debug: {
				token,
				refreshToken,
				userId,
			},
		})
	},
)

