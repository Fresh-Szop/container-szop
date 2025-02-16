import { z } from "zod"
import { Base64 } from "js-base64"

const authLinkSchema = z.object({
	authLink: z.string()
		.url(),
	expires: z.number(),
})

const userSchema = z.object({
	userId: z.string(),
	email: z.string()
		.email(),
	firstName: z.string(),
	lastName: z.string(),
	picture: z.string()
		.url(),
})

function cookies() {
	return new Map(
		document.cookie.split(";")
			.map(v => v.split("=", 2)) as [string, string][]
	)
}

export default async function login() {
	const resp = await fetch("http://localhost:42069/auth/google", {
		credentials: "include",
	})
	const body = authLinkSchema.parse(await resp.json())
	const timeout = body.expires - new Date().getTime()

	const width = 480
	const height = 640
	const left = (screen.width - width) / 2
	const top = (screen.height - height) / 2

	return await new Promise((
		res: (val: z.infer<typeof userSchema>) => void,
		rej: (why: Error) => void
	) => {
		const authWindow = window.open(
			body.authLink,
			"_blank",
			`popup,resizable,scrollbars,width=${width},height=${height},left=${left},top=${top}`
		)
		if (!authWindow) {
			return rej(Error("Failed to launch auth window."))
		}

		function onAuthClosed(e: Event) {
			const biscuits = cookies()
			if (biscuits.has("auth-result")) {
				try {
					const user = JSON.parse(Base64.decode(biscuits.get("auth-result")!))
					res(userSchema.parse(user))
				} catch (e) {
					if (e instanceof Error) {
						rej(Error("Unknown user shape", {cause: e}))
					} else {
						rej(Error(String(e)))
					}
				}
			} else if (biscuits.has("auth-error")) {
				rej(Error(Base64.decode(biscuits.get("auth-error") || "")))
			} else {
				rej(Error("Unknown auth error"))
			}

			window.removeEventListener("auth-close", onAuthClosed)
		}

		window.addEventListener("auth-closed", onAuthClosed)
	})
}

window["$__login__$"] = login
