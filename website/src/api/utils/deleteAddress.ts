import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

export const DeleteAddress = async (
  name: string,
): Promise<any | AxiosError> => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_GATEWAY}/addresses/${name}`,
      { withCredentials: true },
    )
    toast.success("🎉 Adres został usunięty")
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się usunąć adresu")
    console.error("Error fetching products: ", error)
    return error.status
  }
}
