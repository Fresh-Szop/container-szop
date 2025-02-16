import "@/env/config.js"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"

import ordersRoutes from "@/api/orders.js"
import productsRoutes from "@/api/products.js"
import recipesRoutes from "@/api/recipes.js"
import db from "@/drizzle/db.js"
import $ from "@/env/env.js"
import { logger } from "hono/logger"
import { jwtCredentials } from "@/middleware/auth.js"

let _ = db
const app = new Hono()

app.use(logger(console.warn))
app.use(jwtCredentials)

app.get("/", c => c.text(`Online :D`))

app.route("", productsRoutes)
app.route("", recipesRoutes)
app.route("", ordersRoutes)

console.log(`>>>    Warehouse is running on ${$.WAREHOUSE}    <<<`)
serve({
	fetch: app.fetch,
	port: +$.WAREHOUSE_PORT,
})



