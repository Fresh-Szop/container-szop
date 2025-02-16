import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

export const DeleteSubscription = async (
  id: number,
): Promise<any | AxiosError> => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_GATEWAY}/subscriptions/${id}`,
      { withCredentials: true },
    )
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się usunąć subskrypcji")
    return error.status
  }
}
