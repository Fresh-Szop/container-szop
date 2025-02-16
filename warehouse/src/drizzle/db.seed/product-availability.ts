import products from "@/drizzle/db.seed/products.js"
import utils from "@/drizzle/db.seed/utils.lib.js"

const amount = new utils.rng("hawkTuaSpitOnDatThing")

type entity = {
	productId: number
	availableUnits: number
}

const productAvailability: entity[] = products.map(
	p => ({
		productId: p.productId,
		availableUnits: amount.randomInt(100, 1000),
	})
)
export default productAvailability 
