declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GOOGLE_CLIENT_ID: string,
			GOOGLE_CLIENT_SECRET: string
			JWT_SECRET: string
			JWT_REFRESH_SECRET: string
			ENCRYPTION_SECRET: string
			WEBSITE: string
			WEBSITE_PORT: string
			GATEWAY: string
			GATEWAY_PORT: string
			STORE: string
			STORE_PORT: string
			WAREHOUSE: string
			WAREHOUSE_PORT: string
			GATEWAY_KV_PORT: string
			STORE_DB_PORT: string
			WAREHOUSE_DB_PORT: string
			RESOURCE_URL: string
			STORE_DB_ROOT_PASSWORD: string
			STORE_DB_DATABASE: string
			STORE_DB_USER: string
			STORE_DB_PASSWORD: string
			WAREHOUSE_DB_ROOT_PASSWORD: string
			WAREHOUSE_DB_DATABASE: string
			WAREHOUSE_DB_USER: string
			WAREHOUSE_DB_PASSWORD: string
		}
	}
}

export { }
