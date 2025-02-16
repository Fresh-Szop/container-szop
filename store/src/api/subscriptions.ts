import repo from "@/drizzle/repository.js"
import O from "@/libs/utils/Objects.js"
import pack from "@/libs/utils/pack.js"
import sc from "@/libs/utils/status-codes.js"
import z_notBlank from "@/libs/utils/z_notBlank.js"
import { requireAuth } from "@/middleware/auth.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const subscriptionRoutes = new Hono()
export default subscriptionRoutes


subscriptionRoutes.post(
	"/subscriptions",
	requireAuth(),
	async c => {
		const userId = O.require(c.get("auth-user"))

		const basket = await repo.Basket.select(userId)

		await repo.Basket.clear(userId)

		const subscriptionId = await repo.Subscriptions.create(
			userId,
			basket,
		)

		return c.json({
			subscriptionId,
		}, sc.success.created)
	},
)

subscriptionRoutes.get(
	"/subscriptions",
	requireAuth(),
	zValidator("query", z.object({
		page: z.coerce
			.number()
			.gte(1)
			.optional()
			.default(1),
		"page-size": z.coerce
			.number()
			.gte(5)
			.lte(90)
			.optional()
			.default(10),
		status: z.enum(["active", "paused"])
			.optional(),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const query = {
			...c.req.valid("query"),
			pageSize: c.req.valid("query")["page-size"],
			userId,
		}

		const rowsCnt = await repo.Subscriptions.count({ filters: query })

		const firstPage = rowsCnt ? 1 : 0
		const lastPage = Math.ceil(rowsCnt ? rowsCnt / query.pageSize : 0)

		if (firstPage && lastPage && query.page > lastPage
			|| firstPage === 0 && query.page > 1
		) {
			return c.text(
				pack`Requested page outside of available data.
				Requested [${query.page}], available [${firstPage}]..[${lastPage}].`,
				sc.error.unprocessableContent,
			)
		}

		const pages = {
			firstPage,
			currentPage: query.page,
			lastPage,
		}

		const [simpleSubscriptions, subscriptionProducts] = await repo.Subscriptions.selectPageWhen({
			filters: query,
			pageRequest: query,
		})

		const aggregatedQuantities = subscriptionProducts.reduce((acc, p) => {
			if (!acc[p.subscriptionId]) {
				acc[p.subscriptionId] = 0
			}
			acc[p.subscriptionId] += p.quantity
			return acc
		}, {} as Record<number, number>)

		return c.json({
			subscriptions: simpleSubscriptions.map(s => ({
				...s,
				finalQuantity: aggregatedQuantities[s.subscriptionId]
			})),
			pages,
		})
	},
)


subscriptionRoutes.get(
	"/subscriptions/$",
	async c => {
		const subscriptions = await repo.Subscriptions.$.selectAll()

		return c.json(subscriptions)
	},
)

subscriptionRoutes.get(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with id [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, subscriptionProducts] = await repo.Subscriptions.select(subscriptionId)

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		return c.json({
			subscription,
			subscriptionProducts,
		})
	},
)

subscriptionRoutes.patch(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	zValidator("json", z.object({
		status: z.enum(["active", "paused"])
			.optional(),
		addressName: z.string()
			.refine(...z_notBlank("addressName"))
			.optional(),
		frequency: z.number()
			.int()
			.min(1)
			.max(12)
			.optional(),
	})),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const subscriptionId = c.req.valid("param").subscriptionId
		const query = c.req.valid("json")


		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with name [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, _] = O.require(await repo.Subscriptions.select(subscriptionId))

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		if (query.addressName) {
			const addressExists = await repo.Addresses.exists(userId, query.addressName)

			if (!addressExists) {
				return c.text(
					`Did not found address with name [${query.addressName}].`,
					sc.error.notFound,
				)
			}
		}

		await repo.Subscriptions.updateData(
			subscriptionId,
			query,
		)

		return c.redirect(
			`/subscriptions/${subscriptionId}`,
			sc.redirect.seeOther,
		)
	},
)

subscriptionRoutes.delete(
	"/subscriptions/:subscriptionId",
	requireAuth(),
	zValidator(
		"param",
		z.object({
			subscriptionId: z.coerce
				.number()
				.int()
				.gte(1),
		}),
	),
	async c => {
		const userId = O.require(c.get("auth-user"))
		const subscriptionId = c.req.valid("param").subscriptionId

		const subscriptionExists = await repo.Subscriptions.exists(subscriptionId)

		if (!subscriptionExists) {
			return c.text(
				`Did not found subscription with name [${subscriptionId}].`,
				sc.error.notFound,
			)
		}

		const [subscription, _] = O.require(await repo.Subscriptions.select(subscriptionId))

		if (subscription.userId !== userId) {
			return c.text(
				pack`Subscription with id [${subscriptionId}] does not belong to
				user with id [${userId}]`,
				sc.error.forbidden,
			)
		}

		await repo.Subscriptions.delete(subscriptionId)

		return c.body(null, sc.success.noContent)
	},
)
