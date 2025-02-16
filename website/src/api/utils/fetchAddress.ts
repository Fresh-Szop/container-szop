import { Address } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const fetchAddress = async (name: string): Promise<Address | any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/addresses/${name}`,
      { withCredentials: true },
    )
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się pobrać szczegółów adresu")
    return error.status
  }
}
