import "src/env/config.ts"
import db from "@/drizzle/db.js"
import t from "@/drizzle/schema-helper.js"

import products from "@/drizzle/db.seed/products.js"
import productPrices from "@/drizzle/db.seed/product-prices.js"
import productAvailability from "@/drizzle/db.seed/product-availability.js"

console.log("Purging data…")
await db.delete(t.ProductAvailability)
await db.delete(t.ProductPrices)
await db.delete(t.Products)
console.log("Done")

console.log("Inserting products…")
await Promise.all(products.map(p =>
	db.insert(t.Products)
	.values(p)
))
console.log("Done")

console.log("Inserting product prices…")
await Promise.all(productPrices.map(pp =>
	db.insert(t.ProductPrices)
	.values(pp)
))
console.log("Done")

console.log("Inserting product availability…")
await Promise.all(productAvailability.map(pa =>
	db.insert(t.ProductAvailability)
	.values(pa)
))
console.log("Done")

process.exit(0)
