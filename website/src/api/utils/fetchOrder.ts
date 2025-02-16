import { OrderDetails } from "@/types/API Responses"
import axios from "axios"
import { StatusCodes } from "http-status-codes"
import { toast } from "react-toastify"

export const fetchOrder = async (id: number): Promise<OrderDetails | any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/orders/${id}`,
      { withCredentials: true },
    )

    return response.data
  } catch (error: any) {
    if (error.status === StatusCodes.NOT_FOUND) {
      window.location.href = "/404"
    }
    toast.error("😥 Nie udało się pobrać szczegółów zamówienia")
    return error.status
  }
}
