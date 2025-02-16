import repo from "@/drizzle/repository.js"
import { allowedPhonePrefixes } from "@/libs/utils/formatPhoneNumber.js"
import O from "@/libs/utils/Objects.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import cors from "@/middleware/cors.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const addressRoutes = new Hono()
export default addressRoutes

addressRoutes.get(
	"addresses",
	cors.public(),
	requireAuth(),
	async c => {
		const userId = O.require(c.get("auth-user"))

		return c.json(
			await repo.Addresses.selectAll(userId)
		)
	},
)

addressRoutes.post(
	"addresses",
	cors.public(),
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
		const userId = O.require(c.get("auth-user"))
		const address = c.req.valid("json")

		const addressExists = await repo.Addresses.exists(userId, address.addressName)

		if (addressExists) {
			const existingAddress = await repo.Addresses.select(userId, address.addressName)

			return c.json(
				existingAddress,
				sc.error.conflict,
			)
		}

		const cratedAddress = await repo.Addresses.insert({
			...address,
			userId,
		})

		return c.json(
			cratedAddress,
			sc.success.created,
		)
	},
)

addressRoutes.get(
	"addresses/:addressName",
	cors.public(),
	requireAuth(),
	zValidator("param", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const addressName = c.req.valid("param").addressName

		const addressExists = await repo.Addresses.exists(userId, addressName)

		if (!addressExists) {
			return c.text(
				`Did not found address with name [${addressName}].`,
				sc.error.notFound,
			)
		}

		const address = await repo.Addresses.select(userId, addressName)

		return c.json(
			address,
			sc.success.ok,
		)
	},
)

addressRoutes.patch(
	"addresses/:addressName",
	cors.public(),
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
		const userId = O.require(c.get("auth-user"))
		const addressName = c.req.valid("param").addressName
		const address = c.req.valid("json")

		const addressExists = await repo.Addresses.exists(userId, addressName)

		if (!addressExists) {
			return c.text(
				`Did not found address with name [${addressName}].`,
				sc.error.notFound,
			)
		}

		if (address.addressName && await repo.Addresses.exists(userId, address.addressName)) {
			const existingAddress = await repo.Addresses.select(userId, address.addressName)

			return c.json(
				existingAddress,
				sc.error.conflict,
			)
		}

		address.addressName && await repo.Subscriptions.updateAddresses(
			addressName,
			userId,
			address.addressName,
		)

		const newAddress = await repo.Addresses.update(
			userId,
			addressName,
			address,
		)

		return c.json(
			newAddress,
			sc.success.ok,
		)
	},
)

addressRoutes.delete(
	"addresses/:addressName",
	cors.public(),
	requireAuth(),
	zValidator("param", z.object({
		addressName: z.string()
			.refine(...z_notBlank("addressName")),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const addressName = c.req.valid("param").addressName

		const addressExists = await repo.Addresses.exists(userId, addressName)

		if (!addressExists) {
			return c.text(
				`Did not found address with name [${addressName}].`,
				sc.error.notFound,
			)
		}

		await repo.Addresses.delete(userId, addressName)

		return c.body(
			null,
			sc.success.noContent,
		)
	},
)
