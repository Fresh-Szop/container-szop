import axios from "axios"
import { BasketData } from "@/types/API Responses"

export const delFromBasket = async (
  productId: number,
  basketQuantity: number,
): Promise<BasketData | undefined> => {
  try {
    // Wyślij żądanie do endpointu z tymi samymi parametrami
    const response = await axios.delete(
      `${import.meta.env.VITE_GATEWAY}/basket/${productId}`,
      { 
        withCredentials: true,
        data: { basketQuantity: basketQuantity }
      },
      
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}
