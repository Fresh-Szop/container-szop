export enum ProductCategory {
  fruit = "Owoc",
  vegetable = "Warzywo",
  // ingredients = 'Składniki'
}

export enum RecipeCategory {
  sides = "Przystawka",
  desserts = "Deser",
  meals = "Danie główne",
  salads = "Sałatka",
  soups = "Zupa",
}

export enum BasketQuantityChangeAction {
  ADD = "increment",
  REMOVE = "decrement",
}
export const sortingOptions = [
  { value: "availability-asc", name: "Dostępność rosnąco" },
  { value: "availability-desc", name: "Dostępność malejąco" },
  { value: "name-asc", name: "Nazwa A-Z" },
  { value: "name-desc", name: "Nazwa Z-A" },
  { value: "price-asc", name: " Cena rosnąco" },
  { value: "price-desc", name: " Cena malejąco" },
]

export const productsPerPageOptions = [
  { value: "5", name: "5" },
  { value: "10", name: "10" },
  { value: "15", name: "15" },
  { value: "20", name: "20" },
]

export enum OrderStatus {
  placed = "Złożone",
  preparing = "W trakcie realizacji",
  delivered = "Zrealizowane",
  rejected = "Anulowane",
  sent = "Wysłane",
}

export enum SubscriptionStatus {
  active = "Aktywny",
  paused = "Nieaktywny",
}
