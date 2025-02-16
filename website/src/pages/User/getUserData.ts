import axios from "axios"
import { UserData } from "@/types/API Responses"

export const getUserData = async (): Promise<UserData | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/users`,
    )
    return response.data
  } catch (error) {
    console.error("Error fetching user data: ", error)
  }
}
