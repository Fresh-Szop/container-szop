import seedrandom from "seedrandom"
import "src/env/config.ts"

class rng {
	generator: seedrandom.PRNG

	constructor(public seed: string) {
		this.generator = seedrandom(seed)
	}

	random() {
		return this.generator()
	}

	randomInt(): number
	randomInt(min: number, max: number): number
	randomInt(min?: number, max?: number) {
		if (min === undefined || max === undefined) {
			return this.generator.int32()
		}
		min = Math.floor(min)
		max = Math.floor(max)
		return Math.floor(this.generator() * (max - min + 1)) + min
	}
}

function* range(start: number, end: number) {
	for (let i = start; i < end; i++) {
		yield i
	}
}

function mod(a: number, b: number) {
	return ((a % b) + b) % b
}

function pSin(x: number, o: [number, number]) {
	const B = Math.PI / (o[1] - o[0])
	const C = o[0]
	return mod(Math.sin(B * (x - C)), 2)
}

const utils = {
	rng,
	range,
	mod,
	pSin,
}
export default utils
