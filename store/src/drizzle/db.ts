import "@/env/config.js"
import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"

const db = drizzle({
	client: await mysql.createConnection({
			host: "host.docker.internal",
			port: +process.env.STORE_DB_PORT,
			user: process.env.STORE_DB_USER,
			password: process.env.STORE_DB_PASSWORD,
			database: process.env.STORE_DB_DATABASE,
	}),
})
export default db
