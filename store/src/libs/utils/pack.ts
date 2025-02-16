function pack(strings: TemplateStringsArray, ...values: any[]) {
	return String.raw({ raw: strings }, ...values)
		.split("\n")
		.map(l => l.trim())
		.filter(l => l)
		.join(" ")
}
export default pack
