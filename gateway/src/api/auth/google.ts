import { getJwtCredentials } from "@/libs/auth/jwt.js"
import sc from "@/libs/utils/status-codes.js"
import tm from "@/libs/utils/time.js"
import { zValidator } from "@hono/zod-validator"
import { google } from "googleapis"
import { Hono } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"
import { z } from "zod"
import $ from "@/env/env.js"
import kv from "@/kv.js"
import api from "@/libs/utils/api.js"


const gClientId = () => process.env.GOOGLE_CLIENT_ID!
const gClientSecret = () => process.env.GOOGLE_CLIENT_SECRET!


function gOAuth2client() {
	return new google.auth.OAuth2({
		clientId: gClientId(),
		clientSecret: gClientSecret(),
		redirectUri: `${$.WEBSITE}/login-callback.html`,
	})
}

const googleAuthRoutes = new Hono()
export default googleAuthRoutes

// This is path called from frontend using fetch.
// It creates new auth link and returns entry url that should be used to
// access it - since frontend needs to launch it in new window,
// as auth consists of many redirects.
googleAuthRoutes.get("/auth/google", async c => {

	// Create state to validate for absence of XSS and get auth link
	const state = crypto.randomUUID()
	const link = gOAuth2client().generateAuthUrl({
		access_type: "offline",
		scope: ["email", "profile"],
		state,
		prompt: "consent",
	})

	// Create magic token used to access auth link, as well as to be a key
	// to auth session, with its state
	const magicToken = crypto.randomUUID()
	const expires = Date.now() + tm.ms.min(10)

	await kv.saveAuthFlow({
		magicToken,
		link,
		state,
		expires
	})

	// Set cookie so that auth callback can send it with Google auth response
	setCookie(
		c,
		"magicToken",
		magicToken,
		{
			maxAge: tm.s.min(1),
			httpOnly: true,
			path: "/"
		}
	)

	// Return auth entry url
	return c.json({
		authLink: `${c.req.url}/${magicToken}`,
		expires
	})
})

// Entry endpoint of validation - frontend should launch it in new window,
// to prevent clutter in navigation history (and need to remember where to
// come back)
googleAuthRoutes.get("/auth/google/:magicToken", async c => {

	// Get magicToken from url and retrieve auth session with it
	const magicToken = c.req.param("magicToken")
	const authMeta = await kv.readAuthFlow(magicToken)

	// Validate that session is present and not expired
	if (!authMeta) {
		return c.text(
			`No such magic token [${magicToken}]. \
			Maybe you should not be here!`,
			sc.error.unauthorized,
		)
	}

	if (!authMeta.expires || authMeta.expires < Date.now()) {
		return c.text(
			`Magic token [${magicToken}] is expired. \
			Please close this tab and try again`,
			sc.error.gone,
		)
	}

	// Redirect to Google login page
	return c.redirect(authMeta.link)
})

// Endpoint to finalize auth - auth callback should call it to pass results
// of Google auth (state and code) and receive auth JWT credentials
googleAuthRoutes.post(
	"/auth/google/finalize",
	zValidator(
		"cookie",
		z.object({
			magicToken: z.string()
				.uuid(),
		})
	),
	zValidator(
		"query",
		z.object({
			state: z.string()
				.uuid(),
			code: z.string(),
		})
	),
	async c => {

		// Get new oAuth2 client and retrieve auth session using magicToken
		// from cookie
		const oauth = gOAuth2client()

		const magicToken = c.req.valid("cookie").magicToken
		const magicSecrets = await kv.readAuthFlow(magicToken)

		if (!magicSecrets) {
			return c.text(
				`No such magic token [${magicToken}] \
				Maybe you should not be here!`,
				sc.error.unauthorized,
			)
		}

		// Retrieve passed state, received state and code,
		// validate state equality to check if there were no XSS
		const expectedState = magicSecrets.state
		const { state, code } = c.req.valid("query")

		if (expectedState !== state) {
			return c.text(
				`State query parameter is mismatched. \
				You might be a victim of XSS attack!`,
				sc.error.unauthorized,
			)
		}

		// Retrieve Google tokens
		const { tokens } = await oauth.getToken(code)
		oauth.setCredentials(tokens)
		const { access_token, refresh_token, expiry_date } = tokens

		// Get user data from Google API
		const oauthV2 = google.oauth2({
			auth: oauth,
			version: "v2"
		})
		const { data: user } = await oauthV2.userinfo.get()
		if (!user) {
			c.text(
				`Could not receive user info for given token. \
				Google API might be down!`,
				sc.exception.badGateway,
			)
		}

		// Insert (or update) user in db)
		const query = await fetch(api($.STORE)`users`, {
			method: "POST",
			headers: {
			  "Content-Type": "application/json"
			},
			body: JSON.stringify({
				userId: user.id!,
				email: user.email!,
				firstName: user.given_name!,
				lastName: user.family_name!,
				picture: user.picture!,
			})
		})

		if (!query.ok) {
			console.error(await query.text())
		}

		// Generate JWT credentials
		const { token, refreshToken } = await getJwtCredentials(
			{ id: user.id!, role: "user" },
			refresh_token!,
			expiry_date!,
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

		// Pop magicToken from cookies and delete auth session
		deleteCookie(
			c,
			"magicToken"
		)
		await kv.deleteAuthFlow(magicToken)

		const createdUser = await query.json()

		// Return user data
		return c.json({
			debug: {
				token,
				refreshToken,
				expiryDate: expiry_date,
			},
			...createdUser
		})
	}
)
