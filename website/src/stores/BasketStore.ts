import { BasketItem } from "@/types/Basket"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Summary } from "../types/Basket"
import { fetchBasketSummary } from "@/api/utils/fetchBasketSummary"
import { BasketData } from "@/types/API Responses"


type BasketStore = {
  basketList: BasketItem[] | null
  basketSummary: Summary | null
  initializeBasket: () => void
  setBasketData: (basketData: BasketData) => void
}

export const useBasketStore = create(
  persist<BasketStore>(
    (set, get) => ({
      basketList: null,
      basketSummary: null,

      initializeBasket: async () => {
        const data = await fetchBasketSummary()
        set({ basketSummary: data?.summary, basketList: data?.products })
      },
      setBasketData: (basketData: BasketData) => {
        set(state => ({
          basketList: (state.basketList = basketData.products),
          basketSummary: (state.basketSummary = basketData.summary),
        }))
      },
    }),

    {
      name: "basket-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
// Initialize basket summary when the store is created
useBasketStore.getState().initializeBasket()
