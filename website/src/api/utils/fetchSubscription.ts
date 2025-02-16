import { OrderDetails, SubscriptionDetails } from "@/types/API Responses"
import axios from "axios"
import { StatusCodes } from "http-status-codes"
import { toast } from "react-toastify"

export const fetchSubscription = async (
  id: number,
): Promise<SubscriptionDetails | any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/subscriptions/${id}`,
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    if (error.status === StatusCodes.NOT_FOUND) {
      window.location.href = "/404"
    }
    toast.error("😥 Nie udało się pobrać szczegółów subskrypcji")
    return error.status
  }
}
