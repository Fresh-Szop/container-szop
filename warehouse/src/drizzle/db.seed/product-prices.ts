import { months } from "@/drizzle/db.js"
import products from "@/drizzle/db.seed/products.js"
import utils from "@/drizzle/db.seed/utils.lib.js"

const value = new utils.rng("allYourBaseAreBelongToUs")
const price = new utils.rng("ermWhatTheSigmaYouYapping")


type entity = {
	productId: number
	basePrice: number
	discountedPrice?: number
	discount?: number
	month: months
	isSeason: boolean
}

const productPrices: entity[] = products.flatMap(
	p => fluctuateProduct(price.randomInt(10, 200) / 20)
		.entries()
		.map(([k, v]) => ({
			productId: p.productId,
			basePrice: v.basePrice,
			discountedPrice: v.discountedPrice,
			discount: v.discount,
			isSeason: v.isSeason,
			month: k,
		})).toArray()
)
export default productPrices

function fluctuateProduct(basePrice: number) {
	let seasonStartIdx = value.randomInt(0, 12)
	let seasonLength = value.randomInt(3, 10)

	let seasonEndIdx = seasonStartIdx + seasonLength
	let nextSeasonIdx = seasonStartIdx + 12

	let posSkew = value.randomInt(5, 20) / 100
	let negSkew = -value.randomInt(5, 20) / 100

	function discount() {
		let res = value.randomInt(-16, 8) / 20
		return res > 0 ? 1 - res : undefined
	}

	let fresh = utils.range(seasonStartIdx, seasonEndIdx)
		.map(x => {
			let p = utils.pSin(x, [seasonStartIdx, seasonEndIdx]) * negSkew
			x = utils.mod(x, 12)
			x = x == 0 ? 12 : x

			let dis = discount()
			let bp = (1 + p) * basePrice

			return [
				x,
				{
					basePrice: +bp.toFixed(2),
					isSeason: true,
					discountedPrice: dis && +(bp * dis).toFixed(2),
					discount: dis && +(1 - dis).toFixed(2)
				}
			] as [months, Omit<entity, "productId" | "month">]
		}).toArray()

	let imported = utils.range(seasonEndIdx, nextSeasonIdx)
		.map(x => {
			let p = utils.pSin(x, [seasonEndIdx, nextSeasonIdx]) * posSkew
			x = utils.mod(x, 12)
			x = x == 0 ? 12 : x

			let dis = discount()
			let bp = (1 + p) * basePrice

			return [
				x,
				{
					basePrice: +bp.toFixed(2),
					isSeason: false,
					discountedPrice: dis && +(bp * dis).toFixed(2),
					discount: dis && +(1 - dis).toFixed(2)
				}
			] as [months, Omit<entity, "productId" | "month">]
		}).toArray()

	let all = [
		...fresh,
		...imported
	]

	return new Map(all)
}
