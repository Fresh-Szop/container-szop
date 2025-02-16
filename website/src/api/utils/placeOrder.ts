import { Address } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const PlaceOrder = async (addressName: string): Promise<{ orderId: number } | any> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_GATEWAY}/orders`,
        { addressName },
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    toast.error("😥 Nie udało się złożyć zamówienia")
    return error.status
  }
}
