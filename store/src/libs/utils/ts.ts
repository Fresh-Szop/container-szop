type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

type ExpandRecursively<T> = T extends object
	? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
	: T

type ts<T> = {
	Expand: Expand<T>,
	ExpandRecursively: ExpandRecursively<T>,
}
export default ts
