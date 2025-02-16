import axios from "axios"
import { toast } from "react-toastify"
import { StatusCodes } from "http-status-codes"

export const LogOut = async (): Promise<any | undefined> => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_GATEWAY}/auth`,
      { withCredentials: true },
    )
    return {status: StatusCodes.NO_CONTENT}
  } catch (error) {
    toast.error("😥 Nie udało się Wylogować")
  }
}
