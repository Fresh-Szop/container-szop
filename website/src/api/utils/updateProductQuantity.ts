import axios from "axios"
import { toast } from "react-toastify"

export const UpdateProductQuantity = async (
  id: number,
  quantity: number,
): Promise<void> => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_GATEWAY}/products/${id}/$`,
      { addedUnits: quantity },
      { withCredentials: true },
    )
    toast.success("🎉 Status zamówienia został zaktualizowany")
  } catch (error: any) {
    toast.error("😥 Nie udało się edytować statusu zamówienia")
  }
}
