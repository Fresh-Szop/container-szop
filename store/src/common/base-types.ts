
namespace bt {
	
	export type User = {
		userId: string,
		email: string,
		firstName: string,
		lastName: string,
		picture: string,
	}

	export type AuthKV = {
		link: string,
		magicToken: string,
		state: string,
		expires: number,
	}

	export type Product = {
		name: string,
		productId: number,
		producer: string,
		category: "vegetable" | "fruit" | "ingredients",
		unit: "szt" | "kg" | "g" | "opak",
		avgUnitWeightKg: number,
		typicalUnitWeight?: `${number}-${number}${"kg" | "g"}` | null,
		description: string,
	}

	export type months = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12


	export type ProductPrice = {
		productId: number,
		month: months,
		basePrice: number,
		isSeason: number,
		discountedPrice?: number | null,
		discount?: number | null,
	}

	export type ProductAvailability = {
		productId: number,
		availableUnits: number,
	}

	export type BasketEntry = {
		userId: string,
		productId: number,
		quantity: number,
	}

	export type Address = {
		addressName: string,
		userId: string
		firstName: string,
		lastName: string,
		firstAddressLine: string,
		secondAddressLine?: string | null,
		postalCode: string,
		postalCity: string,
		phoneNumber: string,
	}

	export type Order = {
		orderId: number,
		userId: string,
		orderDate: number | Date,
		preparationDate: number | Date,
		sentDate: number | Date,
		deliveryDate: number | Date,
		finalBasePrice: number,
		finalDiscountedPrice: number,
		addressName: string,
		firstName: string,
		lastName: string,
		firstAddressLine: string,
		secondAddressLine?: string | null,
		postalCode: string,
		postalCity: string,
		phoneNumber: string,
	}

	export type OrderRejection = {
		orderId: number,
		productId: number,
		expectedQuantity: number,
		actualQuantity: number,
	}

	export type OrderProduct = {
		orderId: number,
		productId: number,
		quantity: number,
		basePrice: number,
		discountedPrice: number,
		finalBasePrice: number,
		finalDiscountedPrice: number,
	}

	export type Subscription = {
		subscriptionId: number,
		userId: string,
		creationDate: number | Date,
		lastOrderDate: number | Date,
		frequency: number,
		addressName?: string | null,
		status: "active" | "paused"
	}

	export type SubscriptionProduct = {
		subscriptionId: number,
		productId: number,
		quantity: number,
	}

	export type PageCursor = {
		firstPage: number,
		currentPage: number,
		lastPage: number,
	}
}
export default bt
