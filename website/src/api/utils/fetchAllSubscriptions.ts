import axios from "axios"
import { AllProductsResponse, SubscriptionsList } from "@/types/API Responses"
import { toast } from "react-toastify"

export const fetchAllSubscriptions = async (): Promise<
  SubscriptionsList | undefined
> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/subscriptions`,
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    toast.error("😥 Nie udało się pobrać listy subskrypcji")
    return error
  }
}
