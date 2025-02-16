import { BasketItem, OrderItem, Summary } from "./Basket"
import { RecipeCategory, SubscriptionStatus } from "./Dictionaries"

export type AllProductsResponse = {
  pages: {
    firstPage: number
    currentPage: number
    lastPage: number
  }
  products: BasketItem[]
}

export type UserData = {
  firstName: string
  lastName: string
  email: string
  picture: string
  userId: string
}

export type BasketData = {
  products: BasketItem[]
  summary: Summary
}

export type RecipeBasketState = {
  products: BasketItem[]
}

export type Recipe = {
  recipeId: number
  img: string
  name: string
  category: RecipeCategory
  difficulty: number
}

export type Recipes = {
  recipes: Recipe[]
  pages: {
    firstPage: number
    currentPage: number
    lastPage: number
  }
}

export type RecipeItem = {
  recipeId: number
  img: string
  name: string
  category: RecipeCategory
  difficulty: number
  steps: string[]
  ingredients: RecipeIngredient[]
}

export type RecipeIngredient = {
  name: string
  productId: number
  quantity: string
}

export type Address = {
  addressName: string
  firstName: string
  lastName: string
  firstAddressLine: string
  secondAddressLine: string
  postalCode: string
  postalCity: string
  phoneNumber: string
}

export type Order = {
  orderId: number
  updateDate: string
  finalDiscountedPrice: number
  status: string
}

export type OrdersList = {
  orders: Order[]
  pages: {
    firstPage: number
    currentPage: number
    lastPage: number
  }
}

export type OrderDetails = {
  orderId: number
  updateDate: string
  finalDiscountedPrice: number
  status: string
  products: OrderItem[]
  finalBasePrice: number
}

export type Subscription = {
  subscriptionId: number
  creationDate: string
  frequency: number
  finalDiscountedPrice: number
  status: string
}

export type SubscriptionOverview = Omit<Subscription, "finalDiscountedPrice">
  & { finalQuantity: number }

export type SubscriptionsList = {
  subscriptions: SubscriptionOverview[]
  pages: {
    firstPage: number
    currentPage: number
    lastPage: number
  }
}

export type SubscriptionDetails = {
  subscriptionId: number
  creationDate: string
  frequency: number
  finalDiscountedPrice: number
  status: string
  addressName: string
  products: OrderItem[]
  finalBasePrice: number
}
