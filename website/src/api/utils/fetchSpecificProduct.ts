import axios from "axios"
import { BasketItem } from "@/types/Basket"
import { StatusCodes } from "http-status-codes"

export const fetchSpecificProduct = async ({
  id,
}: {
  id: number
}): Promise<BasketItem | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/products/${id}`,
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    if (error.status === StatusCodes.NOT_FOUND) {
      window.location.href = "/404"
    }
    return error.status
  }
}
