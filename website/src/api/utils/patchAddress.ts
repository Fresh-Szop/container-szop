import { Address } from "@/types/API Responses"
import axios from "axios"
import { toast } from "react-toastify"

export const PatchAddress = async (
  data: Address,
): Promise<Address | any> => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_GATEWAY}/addresses/${data.addressName}`,
      data,
      { withCredentials: true },
    )
    toast.success("🎉 Adres został edytowany")
    return response
  } catch (error: any) {
    toast.error("😥 Nie udało się edytować adresu")
    return error.status
  }
}
