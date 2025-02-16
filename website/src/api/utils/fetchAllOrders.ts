import { OrdersList } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const fetchAllOrders = async (): Promise<OrdersList | any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/orders`,
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    toast.error("😥 Nie udało się pobrać zamówień")
    return error.status
  }
}
