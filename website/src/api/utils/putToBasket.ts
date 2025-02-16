import axios from "axios"
import { BasketData } from "@/types/API Responses"
import { useBasketStore } from "@/stores/BasketStore"

export const putToBasket = async (
  
  productId: number,
  basketQuantity: number,
): Promise<BasketData | undefined> => {
  const formData = new FormData()
  formData.append("basketQuantity", basketQuantity.toString())
  try {
    // Wyślij żądanie do endpointu z tymi samymi parametrami
    const response = await axios.put(
      `${import.meta.env.VITE_GATEWAY}/basket/${productId}`,
      { basketQuantity: basketQuantity },
      {
        withCredentials: true,
      },
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}
