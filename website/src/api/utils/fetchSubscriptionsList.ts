import { OrderDetails, SubscriptionDetails } from "@/types/API Responses"
import axios from "axios"
import { StatusCodes } from "http-status-codes"
import { toast } from "react-toastify"

export const fetchSubscriptionsList = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/subscriptions/$`,
      { withCredentials: true },
    )
    toast.success("🎉 Pomyślnie pobrano i wyświetlono w konsoli listę subskrypcji. ")
    return response.data
  } catch (error: any) {
    toast.error("😥 Nie udało się pobrać listy subskrypcji")
    return error.status
  }
}
