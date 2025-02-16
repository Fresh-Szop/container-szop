import $ from "@/env/env.js"
import api from "@/libs/utils/api.js"
import { allowedPhonePrefixes } from "@/libs/utils/formatPhoneNumber.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { StatusCode } from "hono/utils/http-status"
import { z } from "zod"

const addressRoutes = new Hono()
export default addressRoutes

addressRoutes.get(
	"addresses",
	requireAuth(),
	async c => {
		const res = await fetch(api($.STORE)`addresses`, {
			method: "GET",
			headers: c.req.header(),
		})

		return c.json(await res.json(), res.status as StatusCode)
	},
)

addressRoutes.post(
	"addresses",
	requireAuth(),
	zValidator("json", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
		firstName: z.string()
			.refine(...z_notBlank("firstName")),
		lastName: z.string()
			.refine(...z_notBlank("lastName")),
		firstAddressLine: z.string()
			.refine(...z_notBlank("firstAddressLine")),
		secondAddressLine: z.string()
			.nullable()
			.optional(),
		postalCode: z.string()
			.refine(v => /\d{2}-\d{3}/.test(v), { message: "Invalid postalCode format" }),
		postalCity: z.string()
			.refine(...z_notBlank("postalCity")),
		phoneNumber: z.string()
			.refine(v => /\d{9}/.test(v), { message: "Invalid phoneNumber format" })
			.refine(
				v => allowedPhonePrefixes.includes(v.substring(0, 2)),
				v => ({
					message: `Invalid phone number starting with ${v.substring(0, 2)}`
				})
			),
	})),
	async c => {
		const res = await fetch(api($.STORE)`addresses`, {
			method: "POST",
			headers: c.req.header(),
			body: JSON.stringify(c.req.valid("json"))
		})

		return c.json(await res.json(), res.status as StatusCode)
	},
)

addressRoutes.get(
	"addresses/:addressName",
	requireAuth(),
	zValidator("param", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	async c => {
		const res = await fetch(api($.STORE)`addresses/${c.req.valid("param").addressName}`, {
			method: "GET",
			headers: c.req.header(),
		})

		switch (res.status) {
			case sc.success.ok: return c.json(await res.json(), res.status as StatusCode)
			case sc.error.notFound: return c.text(await res.text(), res.status as StatusCode)
		}
	},
)

addressRoutes.patch(
	"addresses/:addressName",
	requireAuth(),
	zValidator("param", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	zValidator("json", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName"))
			.optional(),
		firstName: z.string()
			.refine(...z_notBlank("firstName"))
			.optional(),
		lastName: z.string()
			.refine(...z_notBlank("lastName"))
			.optional(),
		firstAddressLine: z.string()
			.refine(...z_notBlank("firstAddressLine"))
			.optional(),
		secondAddressLine: z.string()
			.nullable()
			.optional(),
		postalCode: z.string()
			.refine(v => /\d{2}-\d{3}/.test(v), { message: "Invalid postalCode format" })
			.optional(),
		postalCity: z.string()
			.refine(...z_notBlank("postalCity"))
			.optional(),
		phoneNumber: z.string()
			.refine(v => /\d{9}/.test(v), { message: "Invalid phoneNumber format" })
			.refine(
				v => allowedPhonePrefixes.includes(v.substring(0, 2)),
				v => ({
					message: `Invalid phone number starting with ${v.substring(0, 2)}`
				})
			)
			.optional(),
	})),
	async c => {
		const res = await fetch(api($.STORE)`addresses/${c.req.valid("param").addressName}`, {
			method: "PATCH",
			headers: c.req.header(),
			body: JSON.stringify(c.req.valid("json"))
		})

		switch (res.status) {
			case sc.success.ok: return c.json(await res.json(), res.status as StatusCode)
			case sc.error.conflict: return c.json(await res.text(), res.status as StatusCode)
			case sc.error.notFound: return c.text(await res.text(), res.status as StatusCode)
		}
	},
)

addressRoutes.delete(
	"addresses/:addressName",
	requireAuth(), zValidator("param", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	async c => {
		const res = await fetch(api($.STORE)`addresses/${c.req.valid("param").addressName}`, {
			method: "DELETE",
			headers: c.req.header(),
		})

		switch (res.status) {
			case sc.success.noContent: return c.body(null, res.status as StatusCode)
			case sc.error.notFound: return c.text(await res.text(), res.status as StatusCode)
		}
	},
)
