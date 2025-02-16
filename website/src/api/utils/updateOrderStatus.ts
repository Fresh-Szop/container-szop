import axios from "axios"
import { toast } from "react-toastify"

export const UpdateOrderStatus = async (
  id: number,
  status: string,
): Promise<void> => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_GATEWAY}/orders/${id}/$`,
      { status },
      { withCredentials: true },
    )
    toast.success("🎉 Status zamówienia został zaktualizowany")
  } catch (error: any) {
    toast.error("😥 Nie udało się edytować statusu zamówienia")
  }
}
