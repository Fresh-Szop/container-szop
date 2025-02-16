import * as _t from "@/drizzle/schema.js"

const t = {
	..._t,
	$first: <T>(v: T[]) => v.at(0),
	$requireOne: <T>(v: T[]) => {
		const result = v.at(0)
		if (!result) throw Error("No rows returned by query!")
		return result
	},
	$requireCount: <T extends { count: number }>(v: T[]) => {
		const result = v.at(0)
		if (!result) throw Error("No rows returned by query!")
		return result.count
	}
}

export default t
