import "@/env/config.js"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"

import authRoutes from "@/api/auth.js"
import $ from "@/env/env.js"
import { jwtCredentials } from "@/middleware/auth.js"
import { logger } from "hono/logger"
import kv from "@/kv.js"
import googleAuthRoutes from "@/api/auth/google.js"
import addressesRoutes from "@/api/addresses.js"
import basketsRoutes from "@/api/baskets.js"
import productsRoutes from "@/api/products.js"
import recipesRoutes from "@/api/recipes.js"
import usersRoutes from "@/api/users.js"
import debugAuthRoutes from "@/api/auth/$.js"
import ordersRoutes from "@/api/orders.js"
import subscriptionRoutes from "@/api/subscriptions.js"

const _ = kv
const app = new Hono()

app.use(cors({
	origin: [
		$.WEBSITE,
	],
	allowHeaders: [
		"Content-Type",
		"Location",
		"Access-Control-Allow-Origin",
		"Set-Cookie",
	],
	allowMethods: [
		"OPTIONS",
		"GET",
		"POST",
		"PUT",
		"PATCH",
		"DELETE",
	],
	exposeHeaders: [
		"Content-Type",
		"Location",
		"Access-Control-Allow-Origin",
		"Set-Cookie",
	],
	credentials: true
}))

app.use(jwtCredentials)
app.use(logger(console.warn))

app.get("/", c => c.text(`Hello GET!`))
app.put("/", c => c.text(`Hello PUT!`))
app.patch("/", c => c.text(`Hello PATCH!`))
app.post("/", c => c.text(`Hello POST!`))
app.delete("/", c => c.text(`Hello DELETE!`))

app.route("", authRoutes)
app.route("", googleAuthRoutes)
app.route("", debugAuthRoutes)
app.route("", usersRoutes)
app.route("", productsRoutes)
app.route("", recipesRoutes)
app.route("", basketsRoutes)
app.route("", addressesRoutes)
app.route("", ordersRoutes)
app.route("", subscriptionRoutes)

console.log(`>>>    Server is running on ${$.GATEWAY}    <<<`)
serve({
	fetch: app.fetch,
	port: +$.GATEWAY_PORT,
})
