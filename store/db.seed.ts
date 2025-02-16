import "src/env/config.ts"
import db from "@/drizzle/db.js"
import t from "@/drizzle/schema-helper.js"

import users from "@/drizzle/db.seed/users.js"

console.log("Purging data…")
await db.delete(t.Users)
console.log("Done")

console.log("Inserting debug users")
await Promise.all(users.map(p =>
	db.insert(t.Users)
	.values(p)
))
console.log("Done")

process.exit(0)
