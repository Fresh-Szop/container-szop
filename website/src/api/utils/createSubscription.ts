import axios from "axios"
import { toast } from "react-toastify"

export const CreateSubscription = async (): Promise<
  { subscriptionId: number } | any
> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_GATEWAY}/subscriptions`,
      {},
      { withCredentials: true },
    )
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się stworzyć subskrypcji")
    return error.status
  }
}
