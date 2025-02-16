
function z_notBlank(name: string) {
	return [
		(v: string) => v.trim().length > 0,
		{ message: `${name} cannot be blank` }
	] as const
}
export default z_notBlank
