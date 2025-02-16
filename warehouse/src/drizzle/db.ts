import "@/env/config.js"
import { Column, InferInsertModel, InferSelectModel, SQL, Table, TableConfig } from "drizzle-orm"
import { drizzle } from "drizzle-orm/mysql2"
import t from "./schema-helper.js"
import mysql from "mysql2/promise"

export { default as recipes } from "@/drizzle/db.seed/recipes.js"

const db = drizzle({
	client: await mysql.createConnection({
			host: "host.docker.internal",
			port: +process.env.WAREHOUSE_DB_PORT,
			user: process.env.WAREHOUSE_DB_USER,
			password: process.env.WAREHOUSE_DB_PASSWORD,
			database: process.env.WAREHOUSE_DB_DATABASE,
	}),
})
export default db
