import { sql } from "drizzle-orm"
import * as s from "drizzle-orm/mysql-core"

export const $now = sql<Date>`now()`

export const Users = s.mysqlTable("Users", {
	userId: s.varchar("user_id", { length: 32 })
		.primaryKey(),
	email: s.varchar({ length: 64 })
		.notNull()
		.unique(),
	firstName: s.varchar("first_name", { length: 48 })
		.notNull(),
	lastName: s.varchar("last_name", { length: 64 })
		.notNull(),
	picture: s.varchar({ length: 512 })
		.notNull(),
})

export const Baskets = s.mysqlTable("Baskets", {
	userId: s.varchar("user_id", { length: 32 })
		.notNull(),
	productId: s.int("product_id")
		.notNull(),
	quantity: s.int()
		.notNull(),
}, t => [
	s.primaryKey({ columns: [t.userId, t.productId] })
])

export const Addresses = s.mysqlTable("Addresses", {
	addressName: s.varchar("address_name", { length: 64 })
		.notNull(),
	userId: s.varchar("user_id", { length: 32 })
		.notNull(),
	firstName: s.varchar("first_name", { length: 48 })
		.notNull(),
	lastName: s.varchar("last_name", { length: 64 })
		.notNull(),
	firstAddressLine: s.varchar("first_address_line", { length: 96 })
		.notNull(),
	secondAddressLine: s.varchar("second_address_line", { length: 96 }),
	postalCode: s.varchar("postal_code", { length: 6 })
		.notNull(),
	postalCity: s.varchar("postal_city", { length: 48 })
		.notNull(),
	phoneNumber: s.varchar("phone_number", { length: 9 })
		.notNull(),
}, t => [
	s.primaryKey({ columns: [t.addressName, t.userId] })
])

export const Subscriptions = s.mysqlTable("Subscriptions", {
	subscriptionId: s.int("subscription_id")
		.primaryKey()
		.autoincrement(),
	userId: s.varchar("user_id", { length: 32 })
		.notNull(),
	creationDate: s.datetime("creation_date")
		.notNull()
		.default($now),
	lastOrderDate: s.datetime("last_order_date",)
		.notNull()
		.default($now),
	frequency: s.int()
		.notNull()
		.default(sql`(4)`),
	addressName: s.varchar({ length: 64 }),
	status: s.mysqlEnum(["active", "paused"])
		.notNull()
		.default("paused"),
})

export const SubscriptionProducts = s.mysqlTable("Subscription_Products", {
	subscriptionId: s.int("subscription_id")
		.notNull(),
	productId: s.int("product_id")
		.notNull(),
	quantity: s.int()
		.notNull(),
}, t => [
	s.primaryKey({ columns: [t.subscriptionId, t.productId] })
])
