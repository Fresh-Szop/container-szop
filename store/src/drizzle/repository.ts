import bt from "@/common/base-types.js"
import db from "@/drizzle/db.js"
import t from "@/drizzle/schema-helper.js"
import O from "@/libs/utils/Objects.js"
import tm from "@/libs/utils/time.js"
import { and, asc, count, countDistinct, desc, eq, gte, inArray, isNotNull, isNull, lte, not, sql } from "drizzle-orm"

type PageRequest = {
	pageRequest: {
		page: number,
		pageSize: number,
	}
}


type Order = "asc" | "desc"

const orderBy = <
	T extends { [key: string]: any },
	F extends keyof T
>(
	iter: T[],
	field: F,
	order: Order,
) => iter.toSorted((a, b) => {
	const fa = a[field]
	const fb = b[field]

	if (fa === null && fb === null) return 0
	if (fa === null) return order === "asc" ? 1 : -1
	if (fb === null) return order === "asc" ? -1 : 1
	if (typeof fa !== typeof fb) throw TypeError(
		`Type mismatch: ${typeof fa} and ${typeof fb} of property ${String(field)}`
	)
	if (typeof fa === "number" && typeof fb === "number")
		return order === "asc" ? fa - fb : fb - fa
	else if (typeof fa === "string" && typeof fb === "string")
		return order === "asc" ? fa.localeCompare(fb) : fb.localeCompare(fa)
	else throw TypeError(
		`Cannot sort on type: ${typeof fa} and ${typeof fb} of property ${String(field)}`
	)
})

export const User = {
	select: (
		id: bt.User["userId"],
	) =>
		db.select()
			.from(t.Users)
			.where(eq(t.Users.userId, id))
			.then(t.$first),

	update: (
		user: bt.User,
	) =>
		db.update(t.Users)
			.set({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				picture: user.picture,
			})
			.where(eq(t.Users.userId, user.userId)),

	upsertAndReturn: (
		user: bt.User,
	) => db.transaction(async tx => {
		await tx.insert(t.Users)
			.values({
				userId: user.userId,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				picture: user.picture,
			}).onDuplicateKeyUpdate({
				set: {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					picture: user.picture,
				}
			})

		return await tx.select()
			.from(t.Users)
			.where(eq(t.Users.userId, user.userId))
			.then(t.$requireOne)
	})
}

export const Basket = {
	select: (userId: bt.User["userId"]) =>
		db.select({
			userId: t.Baskets.userId,
			productId: t.Baskets.productId,
			quantity: t.Baskets.quantity,
		})
			.from(t.Baskets)
			.where(eq(t.Baskets.userId, userId)),

	increaseProduct: (
		userId: bt.User["userId"],
		productId: bt.BasketEntry["productId"],
		quantity: bt.BasketEntry["quantity"],
	) => db.insert(t.Baskets)
		.values({
			userId,
			productId,
			quantity: sql`${quantity}`,
		})
		.onDuplicateKeyUpdate({
			set: {
				quantity: sql`(${t.Baskets.quantity} + ${quantity})`,
			}
		}),

	decreaseProduct: (
		userId: bt.User["userId"],
		productId: bt.BasketEntry["productId"],
		quantity: bt.BasketEntry["quantity"],
	) => db.update(t.Baskets)
		.set({
			quantity: sql`greatest(${t.Baskets.quantity} - ${quantity}, 0)`,
		})
		.where(and(
			eq(t.Baskets.userId, userId),
			eq(t.Baskets.productId, productId),
		)),

	clear: (
		userId: bt.User["userId"],
	) => db.delete(t.Baskets)
		.where(eq(t.Baskets.userId, userId))
}

export const Addresses = {
	selectAll: (userId: bt.Address["userId"]) =>
		db.select({
			addressName: t.Addresses.addressName,
		})
			.from(t.Addresses)
			.where(eq(t.Addresses.userId, userId)),

	select: (
		userId: bt.Address["userId"],
		addressName: bt.Address["addressName"],
	) =>
		db.select({
			addressName: t.Addresses.addressName,
			firstName: t.Addresses.firstName,
			lastName: t.Addresses.lastName,
			firstAddressLine: t.Addresses.firstAddressLine,
			secondAddressLine: t.Addresses.secondAddressLine,
			postalCode: t.Addresses.postalCode,
			postalCity: t.Addresses.postalCity,
			phoneNumber: t.Addresses.phoneNumber,
		})
			.from(t.Addresses)
			.where(and(
				eq(t.Addresses.userId, userId),
				eq(t.Addresses.addressName, addressName),
			))
			.then(t.$first),

	exists: (
		userId: bt.Address["userId"],
		addressName: bt.Address["addressName"],
	) => db.select({
		addressName: t.Addresses.addressName,
	})
		.from(t.Addresses)
		.where(and(
			eq(t.Addresses.userId, userId),
			eq(t.Addresses.addressName, addressName),
		))
		.then(t.$first)
		.then(a => a !== undefined),

	insert: (
		address: bt.Address
	) => db.transaction(async tx => {
		const newAddress = await db.insert(t.Addresses)
			.values(address)
			.$returningId()

		return db.select()
			.from(t.Addresses)
	}),

	update: (
		userId: bt.Address["userId"],
		addressName: bt.Address["addressName"],
		address: Omit<Partial<bt.Address>, "userId">,
	) => db.transaction(async tx => {

		await db.update(t.Addresses)
			.set({
				addressName: address.addressName,
				firstName: address.firstName,
				lastName: address.lastName,
				firstAddressLine: address.firstAddressLine,
				secondAddressLine: address.secondAddressLine,
				postalCode: address.postalCode,
				postalCity: address.postalCity,
				phoneNumber: address.phoneNumber,
			})
			.where(and(
				eq(t.Addresses.userId, userId),
				eq(t.Addresses.addressName, addressName),
			))
		
		return await db.select()
			.from(t.Addresses)
			.where(eq(
				t.Addresses.addressName,
				address.addressName ?? addressName,
		))
	}),

	delete: (
		userId: bt.Address["userId"],
		addressName: bt.Address["addressName"],
	) => db.delete(t.Addresses)
		.where(and(
			eq(t.Addresses.userId, userId),
			eq(t.Addresses.addressName, addressName),
		)),
}


type SubscriptionsRequest = {
	filters: {
		status?: bt.Subscription["status"],
		userId: bt.Subscription["userId"],
	},
}

type SubscriptionChange = {
	status?: bt.Subscription["status"],
	addressName?: bt.Subscription["addressName"],
	frequency?: bt.Subscription["frequency"],
}

export const Subscriptions = {

	create: (
		userId: bt.Subscription["userId"],
		products: Omit<bt.SubscriptionProduct, "subscriptionId">[],
	) => db.transaction(async tx => {

		const subscription = await tx.insert(t.Subscriptions)
			.values({
				userId
			})
			.$returningId()
			.then(t.$requireOne)

		await tx.insert(t.SubscriptionProducts)
			.values(products.map(p => ({ ...p, subscriptionId: subscription.subscriptionId })))

		return subscription.subscriptionId
	}),

	count: (
		{ filters }: Pick<SubscriptionsRequest, "filters">
	) => db.select({
		count: count()
	})
		.from(t.Subscriptions)
		.where(and(
			filters.status ? eq(t.Subscriptions.status, filters.status) : undefined,
			eq(t.Subscriptions.userId, filters.userId),
		))
		.then(t.$requireCount),

	selectPageWhen: (
		{
			filters,
			pageRequest,
		}: SubscriptionsRequest & PageRequest
	) => db.transaction(async tx => {
		const baseIdentifiers = tx.select({ subscriptionId: t.Subscriptions.subscriptionId })
			.from(t.Subscriptions)
			.where(and(
				filters.status ? eq(t.Subscriptions.status, filters.status) : undefined,
				eq(t.Subscriptions.userId, filters.userId),
			))
			.orderBy(desc(t.Subscriptions.creationDate))
			.limit(pageRequest.pageSize)
			.offset((pageRequest.page - 1) * pageRequest.pageSize)
			.as("identifiers")

		const subscriptions = await tx.select({
			subscriptionId: t.Subscriptions.subscriptionId,
			creationDate: t.Subscriptions.creationDate,
			frequency: t.Subscriptions.frequency,
			status: t.Subscriptions.status,
		})
			.from(t.Subscriptions)
			.innerJoin(
				baseIdentifiers,
				eq(t.Subscriptions.subscriptionId, baseIdentifiers.subscriptionId),
			)
			.orderBy(desc(t.Subscriptions.creationDate))

		const products = await tx.select({
			subscriptionId: t.SubscriptionProducts.subscriptionId,
			productId: t.SubscriptionProducts.productId,
			quantity: t.SubscriptionProducts.quantity,
		})
			.from(t.SubscriptionProducts)
			.innerJoin(
				baseIdentifiers,
				eq(t.SubscriptionProducts.subscriptionId, baseIdentifiers.subscriptionId),
			)

		return [subscriptions, products] as const
	}),

	select: (
		subscriptionId: bt.Subscription["subscriptionId"]
	) => db.transaction(async tx => {

		const subscription = await tx.select({
			userId: t.Subscriptions.userId,
			subscriptionId: t.Subscriptions.subscriptionId,
			creationDate: t.Subscriptions.creationDate,
			frequency: t.Subscriptions.frequency,
			status: t.Subscriptions.status,
			addressName: t.Subscriptions.addressName,
		})
			.from(t.Subscriptions)
			.where(eq(t.Subscriptions.subscriptionId, subscriptionId))
			.then(t.$requireOne)

		const products = await tx.select({
			productId: t.SubscriptionProducts.productId,
			quantity: t.SubscriptionProducts.quantity,
		})
			.from(t.SubscriptionProducts)
			.where(eq(t.SubscriptionProducts.subscriptionId, subscriptionId))

		return [subscription, products] as const
	}),

	exists: (
		subscriptionId: bt.Subscription["subscriptionId"],
	) => db.select({
		subscriptionId: t.Subscriptions.subscriptionId,
	})
		.from(t.Subscriptions)
		.where(eq(t.Subscriptions.subscriptionId, subscriptionId))
		.then(t.$first)
		.then(p => p !== undefined),

	updateAddresses: (
		oldAddressName: NonNullable<bt.Subscription["addressName"]>,
		userId: bt.Subscription["userId"],
		newAddressName: bt.Subscription["addressName"],
	) => db.update(t.Subscriptions)
		.set({
			addressName: newAddressName,
		})
		.where(and(
			eq(t.Subscriptions.userId, userId),
			eq(t.Subscriptions.addressName, oldAddressName),
		)),

	updateData: (
		subscriptionId: bt.Subscription["subscriptionId"],
		dataChange: SubscriptionChange,
	) => db.update(t.Subscriptions)
		.set(dataChange)
		.where(eq(t.Subscriptions.subscriptionId, subscriptionId)),

	delete: (
		subscriptionId: bt.Subscription["subscriptionId"],
	) => db.transaction(async tx => {
		await tx.delete(t.SubscriptionProducts)
			.where(eq(t.SubscriptionProducts.subscriptionId, subscriptionId))

		await tx.delete(t.Subscriptions)
			.where(eq(t.Subscriptions.subscriptionId, subscriptionId))
	}),

	$: {
		selectAll: () => db.select({
			subscriptionId: t.Subscriptions.subscriptionId,
			lastOrderDate: t.Subscriptions.lastOrderDate,
			frequency: t.Subscriptions.frequency,
		})
			.from(t.Subscriptions)
			.then(ss => ss.map(s => {

				return {
					subscriptionId: s.subscriptionId,
					nextOrderDate: new Date(+s.lastOrderDate + tm.ms.w(s.frequency)),
				}
			})),

		updateLastOrderDate: (
			subscriptionId: bt.Subscription["subscriptionId"],
			newOrderDate: bt.Subscription["lastOrderDate"],
		) => db.update(t.Subscriptions)
			.set({
				lastOrderDate: new Date(newOrderDate),
			})
			.where(eq(t.Subscriptions.subscriptionId, subscriptionId)),
	},
}

const repo = {
	User,
	Basket,
	Addresses,
	Subscriptions,
}

export default repo
