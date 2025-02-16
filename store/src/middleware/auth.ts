import { getJwtCredentials, jwtRefreshSchema, jwtTokenSchema } from "@/libs/auth/jwt.js"
import aes from "@/libs/utils/AES.js"
import sc from "@/libs/utils/status-codes.js"
import time from "@/libs/utils/time.js"
import { google } from "googleapis"
import { getCookie, setCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import * as jwt from "hono/jwt"

const gClientId = () => process.env.GOOGLE_CLIENT_ID!
const gClientSecret = () => process.env.GOOGLE_CLIENT_SECRET!
const jwtSecret = () => process.env.JWT_SECRET!
const jwtRefreshSecret = () => process.env.JWT_REFRESH_SECRET!


function gOAuth2client() {
	return new google.auth.OAuth2({
		clientId: gClientId(),
		clientSecret: gClientSecret(),
		redirectUri: `${process.env.FRONTEND_URL}/login-callback.html`,
	})
}

export const jwtCredentials = createMiddleware(async (c, next) => {

	// Retrieve tokens from cookies
	let token = getCookie(c, "bearer")
	let refreshToken = getCookie(c, "refresh")

	// Check if refresh token is present
	// it missing or invalid implies unauthorized user
	if (!refreshToken) {
		c.set("auth-error", "unauthorized")
		return next()
	}
	let validRefreshToken = await jwt.verify(refreshToken, jwtRefreshSecret())
		.catch(e => {
			// console.log(e)
			return null
		})
	if (!validRefreshToken) {
		c.set("auth-error", "verification-failed")
		return await next()
	}
	const {
		data: actualRefreshToken,
		error: refreshError
	} = jwtRefreshSchema.safeParse(validRefreshToken)
	if (refreshError) {
		c.set("auth-error", "possible XSS")
		return await next()
	}

	// Check if normal token is present
	// it missing or invalid makes refreshing credentials necessary
	// it being not parsed implies possible XSS
	const shouldRefresh = !token ||
		!(await jwt.verify(token, jwtSecret())
			.catch(_ => null))

	if (!shouldRefresh) {
		// const {
		// 	data: actualToken,
		// 	error: tokenError
		// } = jwtTokenSchema.safeParse(await jwt.verify(token, jwtSecret()))
		if (refreshError) {
			c.set("auth-error", "possible XSS")
			return await next()
		}
	}

	if (shouldRefresh) {

		// Check if debug user - if so, then skip to blind refresh
		const roles = actualRefreshToken.rol.split("|")
		if (roles.includes("debug")) {
			
			const refresh_token = aes.decrypt(actualRefreshToken!.ref)
			const userId = actualRefreshToken.sub

			// Regenerate tokens
			let newCredentials = await getJwtCredentials(
				{ id: userId, role: roles.join("|") },
				refresh_token,
			)
			token = newCredentials.token
			refreshToken = newCredentials.refreshToken
		}
		// Otherwise, test google API to determine if user is refreshable
		else {
		
			// Call google API to verify user existence
			const refresh_token = aes.decrypt(actualRefreshToken!.ref)
			const oauth = gOAuth2client()
			oauth.setCredentials({
				refresh_token
			})

			const oauthV2 = google.oauth2({
				auth: oauth,
				version: "v2"
			})
			const { data: user } = await oauthV2.userinfo.get()

			if (!user) {
				return c.text(
					"Could not receive user info for given token." +
					" Google API might be down, or user was deleted!",
					sc.error.badRequest,
				)
			}

			// Regenerate tokens
			let newCredentials = await getJwtCredentials(
				{ id: user.id!, role: "user" },
				refresh_token,
			)
			token = newCredentials.token
			refreshToken = newCredentials.refreshToken
		}

		// Push JWT credentials into cookies
		setCookie(
			c,
			"bearer",
			token!,
			{
				maxAge: time.s.min(59),
				httpOnly: true,
				path: "/"
			}
		)
		setCookie(
			c,
			"refresh",
			refreshToken,
			{
				maxAge: time.s.min(59) + time.s.d(7),
				httpOnly: true,
				path: "/"
			}
		)
	}

	c.set("auth-user", actualRefreshToken?.sub)
	c.set("auth-role", actualRefreshToken?.rol)

	return await next()
})

export const requireAuth = (requiredRole?: string) => createMiddleware(async (c, next) => {
	switch (c.get("auth-error")) {
		case "google-auth-failed":
			return c.text(
				"Problem with retrieving user from google API." +
				" gAPI might be down, refresh token was spoiled after 6 months" +
				" of in inactivity, or user was deleted.",
				sc.error.unauthorized,
			)
		case "verification-failed":
			return c.text(
				"User was inactive for more than a week, or server was restarted." +
				" Please login again.",
				sc.error.unauthorized,
			)
		case "possible XSS":
			return c.text(
				"Provided credentials were of wrong type." +
				" Possible XSS attack, or old version of jwt.",
				sc.error.unprocessableContent,
			)
		case "unauthorized":
			return c.text(
				"No credentials present. Make sure to send cookies with" +
				" request, or login.",
				sc.error.unauthorized,
			)
		case undefined:
			if (
				requiredRole &&
				!c.get("auth-role")!
					.split("|")
					.includes(requiredRole)
			) {
				return c.text(
					"Your permission group does not permit access.",
					sc.error.forbidden,
				)
			} else return await next()
		default:
			return c.text(
				`Unknown auth error: ${c.get("auth-error")}`,
				sc.exception.notImplemented,
			)
	}
})

type authError = "verification-failed"
	| "google-auth-failed"
	| "unauthorized"
	| "possible XSS"
	| undefined

declare module "hono" {
	interface ContextVariableMap {
		"auth-user": string | undefined
		"auth-role": string | undefined
		"auth-error": authError
	}
}
