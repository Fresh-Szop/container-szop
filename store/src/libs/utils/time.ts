const tm = {
	ms: {
		w: (howMany: number) => howMany * 7 * 24 * 60 * 60 * 1000,
		d: (howMany: number) => howMany * 24 * 60 * 60 * 1000,
		h: (howMany: number) => howMany * 60 * 60 * 1000,
		min: (howMany: number) => howMany * 60 * 1000,
		s: (howMany: number) => howMany * 1000,
		ms: (howMany: number) => howMany,
	} as const,
	s: {
		w: (howMany: number) => howMany * 7 * 24 * 60 * 60,
		d: (howMany: number) => howMany * 24 * 60 * 60,
		h: (howMany: number) => howMany * 60 * 60,
		min: (howMany: number) => howMany * 60,
		s: (howMany: number) => howMany,
		ms: (howMany: number) => howMany / 1000,
	} as const,
}
export default tm
