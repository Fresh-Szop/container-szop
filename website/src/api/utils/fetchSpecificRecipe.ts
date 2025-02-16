import axios from "axios"
import { RecipeItem } from "@/types/API Responses"
import { toast } from "react-toastify"
import { StatusCodes } from "http-status-codes"

export const fetchSpecificRecipe = async ({
  id,
}: {
  id: number
}): Promise<RecipeItem | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/recipes/${id}`,
    )
    // console.log(response.data)
    return response.data
  } catch (error: any) {
    if (error.status === StatusCodes.NOT_FOUND) {
      window.location.href = "/404"
    }
    toast.error("😥 Nie udało się pobrać przepisu")
    window.location.href = "/404"
  }
}
