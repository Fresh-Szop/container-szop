import { Address } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const PostNewAddress = async (data: Address): Promise<number | any> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_GATEWAY}/addresses`,
      data,
      { withCredentials: true },
    )
    console.log(response)
    return response.status
  } catch (error: any) {
    toast.error("😥 Nie udało się dodać adresu")
    return error.status
  }
}
