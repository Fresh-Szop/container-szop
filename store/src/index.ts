import "@/env/config.js"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import db from "@/drizzle/db.js"
import $ from "@/env/env.js"
import { logger } from "hono/logger"
import addressRoutes from "@/api/addresses.js"
import basketsRoutes from "@/api/baskets.js"
import subscriptionRoutes from "@/api/subscriptions.js"
import usersRoutes from "@/api/users.js"
import cors from "@/middleware/cors.js"
import { jwtCredentials } from "@/middleware/auth.js"

let _ = db
const app = new Hono()

app.use(cors.public())  
app.use(logger(console.warn))
app.use(jwtCredentials)

app.get("/", c => c.text(`Online :D`))

app.route("", addressRoutes)
app.route("", basketsRoutes)
app.route("", subscriptionRoutes)
app.route("", usersRoutes)

console.log(`>>>    Store is running on ${$.STORE}    <<<`)
serve({
	fetch: app.fetch,
	port: +$.STORE_PORT,
})


