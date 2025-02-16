export type BasketItem = {
  productId: number
  name: string
  producer: string
  category: string
  unit: string
  unitQuantity: number
  avgUnitWeightKg: number
  typicalUnitWeight: number | null
  availableUnits: number
  basePrice: number
  discountedPrice: number
  discount: number
  isSeason: boolean
  description: string
  basketQuantity: number
}

export type OrderItem = BasketItem & {
  finalBasePrice: number
  finalDiscountedPrice: number
}

export type Summary = {
  finalBasePrice: number
  finalDiscountedPrice: number
  basketQuantity: number
}

export type BasketAddProduct = {
  productId: number
  basketQuantity: number
}
