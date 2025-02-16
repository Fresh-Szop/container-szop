import bt from "./base-types.js"

namespace rt {

	export type Quantity = { basketQuantity: number }

	export type FullProduct = bt.Product
		& bt.ProductAvailability
		& Omit<bt.ProductPrice, "month">
		& Partial<Quantity>

	export type BasketPrice = {
		finalBasePrice: number,
		finalDiscountedPrice: number,
	}

	export type BasketProduct = FullProduct & BasketPrice

	export type BasketConflict = {
		productId: number,
		expectedBasketQuantity: number,
		actualBasketQuantity: number,
	}

	export type Basket = {
		products: BasketProduct[],
		summary: Pick<BasketProduct, "finalBasePrice" | "finalDiscountedPrice" | "basketQuantity">,
		conflicts?: BasketConflict[],
	}

	export type RecipeOverview = {
		recipeId: number,
		img: string,
		name: string,
		category: "desserts" | "sides" | "soups" | "meals" | "salads",
		difficulty: 1 | 2 | 3 | 4 | 5,
	}

	export type Recipe = RecipeOverview & {
		steps: string[],
		ingredients: {
			name: string,
			productId?: number | null,
			quantity: string,
		}[]
	}

	export type OrderStatus = {
		updateDate: number | Date,
		status: "placed" | "preparing" | "sent" | "delivered" | "rejected",
	}

	export type OrderOverview = Pick<bt.Order, "orderId" | "finalDiscountedPrice">
		& OrderStatus



	export type FreezedProduct = bt.Product
		& Omit<bt.ProductPrice, "month" | "isSeason">
		& Quantity
		& BasketPrice

	export type Order = bt.Order
		& OrderStatus
		& bt.Address
		& {
			products: FreezedProduct[],
			rejectionReason?: BasketConflict[],
		}

	export type SubscriptionOverview = Omit<bt.Subscription, "addressName" | "lastOrderDate" | "userId">
		& Pick<BasketPrice, "finalDiscountedPrice">

	export type FullSubscription = Omit<bt.Subscription, "userId">
		& BasketPrice
		& { products: FullProduct[] }
}

export default rt
