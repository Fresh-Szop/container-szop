import $ from "@/env/env.js"
import * as hcors from "hono/cors"

const cors = {
	internal: () => hcors.cors({
		origin: [
			$.GATEWAY,
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
	}),
	public: () => hcors.cors({
		origin: [
			$.GATEWAY,
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
	}),
}
export default cors
