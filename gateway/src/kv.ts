
import bt from "@/common/base-types.js"
import $ from "@/env/env.js"
import O from "@/libs/utils/Objects.js"
import { Redis } from "iovalkey"
const valkey = new Redis(`host.docker.internal:${$.GATEWAY_KV_PORT}`)

const kv = {
	valkey,
	saveAuthFlow: async (flow: bt.AuthKV) => {
		await valkey.set(flow.magicToken, JSON.stringify(O.without(flow, ["magicToken"])))
	},
	readAuthFlow: async (magicToken: string) => {
		const data = await valkey.get(magicToken)

		if (data) {
			return JSON.parse(data) as bt.AuthKV
		} else {
			return null
		}
	},
	deleteAuthFlow: async (magicToken: string) => {
		await valkey.del(magicToken)
	}
}
export default kv
