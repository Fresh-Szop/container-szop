import { Subscription } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const PatchSubscription = async (
  data: { status: string; addressName: string; frequency: number },
  id: number,
): Promise<Subscription | any> => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_GATEWAY}/subscriptions/${id}`,
      data,
      { withCredentials: true },
    )
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się edytować subskrypcji")
    return error.status
  }
}
