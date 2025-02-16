import "src/env/config.ts"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "mysql",
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dbCredentials: {
		host: "host.docker.internal",
		port: +process.env.WAREHOUSE_DB_PORT,
		user: process.env.WAREHOUSE_DB_USER,
		password: process.env.WAREHOUSE_DB_PASSWORD,
		database: process.env.WAREHOUSE_DB_DATABASE,
	},
	strict: true,
	verbose: true,
})
