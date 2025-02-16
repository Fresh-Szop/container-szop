import axios from "axios"
import { toast } from "react-toastify"

export const UpdateSubscriptionTick = async (id: number): Promise<void> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_GATEWAY}/subscriptions/${id}/$`,
      {},
      { withCredentials: true },
    )
    toast.success("🎉 Wymuszony tick subskrypcji")
  } catch (error: any) {
    toast.error("😥 Nie udało się wymusić ticku subksrypcji")
  }
}
