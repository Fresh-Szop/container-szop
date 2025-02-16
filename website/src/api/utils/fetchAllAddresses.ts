import axios from "axios"
import { toast } from "react-toastify"

export type Address = {
  addressName: string;
};
export type Addresses = Address[];
export const fetchAllAddresses = async (): Promise<Addresses | any> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/addresses`,
      { withCredentials: true },
    )
    return response.data
  } catch (error: any) {
    toast.error("😥 Nie udało się pobrać adresów")
    return {
      addressName: [],
      message: "Error fetching addresses",
    }
  }
}
