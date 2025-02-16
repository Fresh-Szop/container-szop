import axios from "axios"
import { BasketData } from "@/types/API Responses"
import { Summary } from "@/types/Basket"

export const fetchBasketSummary = async (): Promise<BasketData | undefined> => {
  try {
    // Wyślij żądanie do endpointu z tymi samymi parametrami
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/basket`,
      {withCredentials: true}
    )
    return response.data
  } catch (error) {
    return;
  }
}
