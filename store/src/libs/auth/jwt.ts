import aes from '@/libs/utils/AES.js'
import time from "@/libs/utils/time.js"
import * as jwt from "hono/jwt"
import { z } from "zod"

const jwtSecret = () => process.env.JWT_SECRET!
const jwtRefreshSecret = () => process.env.JWT_REFRESH_SECRET!

export const jwtTokenSchema = z.object({
	sub: z.string({ message: "Token is missing user id" }),
	rol: z.string({ message: "Token is missing user role" }),
	exp: z.number({ message: "Token is missing expiration date" }),
	iat: z.number({ message: "Token is missing issue date" }),
})

export const jwtRefreshSchema = z.object({
	sub: z.string({ message: "Refresh token is missing user id" }),
	rol: z.string({ message: "Refresh token is missing user role" }),
	exp: z.number({ message: "Refresh token is missing expiration date" }),
	iat: z.number({ message: "Refresh token is missing issue date" }),
	ref: z.string({ message: "Refresh token is missing auth token" }),
})

export async function getJwtCredentials(
	user: { id: string, role: string },
	googleRefreshToken: string,
	expiryDate?: number,
) {

	const now = Date.now()
	if (expiryDate == null) {
		expiryDate = time.ms.ms(now) + time.ms.h(1)
	}

	const token = await jwt.sign(
		{
			sub: user.id!,
			rol: user.role,
			exp: time.s.ms(expiryDate),
			iat: time.s.ms(now),
		} satisfies z.infer<typeof jwtTokenSchema>,
		jwtSecret(),
	)
	const refreshToken = await jwt.sign(
		{
			sub: user.id!,
			rol: user.role,
			exp: time.s.ms(expiryDate) + time.s.d(7),
			iat: time.s.ms(now),
			ref: aes.encrypt(googleRefreshToken!),
		} satisfies z.infer<typeof jwtRefreshSchema>,
		jwtRefreshSecret(),
	)

	return { token, refreshToken }
}
