import bt from "@/common/base-types.js"
import { sql } from "drizzle-orm"
import * as s from "drizzle-orm/mysql-core"

export const $now = sql<Date>`now()`

export const Products = s.mysqlTable("Products", {
	productId: s.int("product_id")
		.primaryKey()
		.autoincrement(),
	name: s.varchar({ length: 48 })
		.notNull()
		.unique(),
	producer: s.varchar({ length: 48 })
		.notNull(),
	category: s.mysqlEnum(["vegetable", "fruit", "ingredients"])
		.notNull(),
	unit: s.mysqlEnum(["szt", "kg", "g", "opak"])
		.notNull(),
	avgUnitWeightKg: s.real("avg_unit_weight_kg")
		.notNull(),
	typicalUnitWeight: s.varchar("typical_unit_weight", { length: 64 })
		.$type<`${number}-${number}${"kg" | "g"}`>(),
	description: s.varchar({ length: 256 })
		.notNull(),
})

export const ProductPrices = s.mysqlTable("Product_Prices", {
	productId: s.int("product_id")
		.notNull(),
	month: s.tinyint()
		.notNull()
		.$type<bt.months>(),
	basePrice: s.double("base_price", { precision: 5, scale: 2 })
		.notNull(),
	isSeason: s.boolean("is_season")
		.notNull(),
	discountedPrice: s.double("discounted_price", { precision: 5, scale: 2 }),
	discount: s.double({ precision: 5, scale: 2 }),
}, t => [
	s.primaryKey({ columns: [t.productId, t.month] }),

	s.check(
		"discount__ck",
		sql`${t.discount} between 0 and 1`
	),
	s.check(
		"discounted_price__ck",
		sql`coalesce(${t.discountedPrice}, 0) <= ${t.basePrice}`
	),
	s.check(
		"month__ck",
		sql`${t.month} between 1 and 12`,
	),
])

export const ProductAvailability = s.mysqlTable("Product_Availability", {
	productId: s.int("product_id")
		.primaryKey(),
	availableUnits: s.int("available_units")
		.notNull(),
}, t => [
	s.check(
		"available_units__ck",
		sql`${t.availableUnits} >= 0`
	),
])

export const Orders = s.mysqlTable("Orders", {
	orderId: s.int("order_id")
		.primaryKey()
		.autoincrement(),
	userId: s.varchar("user_id", { length: 32 })
		.notNull(),
	orderDate: s.datetime("order_date")
		.notNull()
		.default($now),
	preparationDate: s.datetime("preparation_date"),
	sentDate: s.datetime("sent_date"),
	deliveryDate: s.datetime("delivery_date"),
	finalBasePrice: s.double("final_base_price", { precision: 8, scale: 2 })
		.notNull(),
	finalDiscountedPrice: s.double("final_discounted_price", { precision: 8, scale: 2 })
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
})

export const OrderRejections = s.mysqlTable("Order_Rejections", {
	orderId: s.int("order_id")
		.notNull(),
	productId: s.int("product_id")
		.notNull(),
	expectedQuantity: s.int()
		.notNull(),
	actualQuantity: s.int()
		.notNull(),
}, t => [
	s.primaryKey({ columns: [t.orderId, t.productId] })
])

export const OrderProducts = s.mysqlTable("Order_Products", {
	orderId: s.int("order_id")
		.notNull(),
	productId: s.int("product_id")
		.notNull(),
	quantity: s.int()
		.notNull(),
	basePrice: s.double("base_price", { precision: 5, scale: 2 })
		.notNull(),
	discountedPrice: s.double("discounted_price", { precision: 5, scale: 2 }),
	finalBasePrice: s.double("final_base_price", { precision: 8, scale: 2 })
		.notNull(),
	finalDiscountedPrice: s.double("final_discounted_price", { precision: 8, scale: 2 })
		.notNull(),
}, t => [
	s.primaryKey({ columns: [t.orderId, t.productId] })
])
