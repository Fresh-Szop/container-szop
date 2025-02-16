export function api(host: string) {
	return function (strings: any, ...values: any[]) {
		return host + "/" + String.raw({ raw: strings }, ...(values.map(v => {
			switch (true) {
				case typeof v == "string": return v
				case typeof v == "number": return v.toString()
				case typeof v == "boolean": return v.toString()
				case v instanceof URLSearchParams: return v.toString()
				default: return JSON.stringify(v)
			}
		})))
	}
}
export default api
