class O {
	static without<T, K extends keyof T>(obj: T, keys: K[]) {
		return Object.fromEntries(
			Object.entries(obj as any).filter(
				([key]) => !keys.includes(key as K)
			)
		) as Omit<T, K>
	}

	static only<T, K extends keyof T>(obj: T, keys: K[]) {
		return Object.fromEntries(
			Object.entries(obj as any).filter(
				([key]) => keys.includes(key as K)
			)
		) as Pick<T, K>
	}

	static require<T>(value: T | null | undefined): T {
		if (value === null || value === undefined) {
			throw new TypeError('Value cannot be null or undefined')
		}
		return value
	}
}

export default O
