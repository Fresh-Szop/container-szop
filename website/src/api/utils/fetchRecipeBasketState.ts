import { RecipeBasketState } from "@/types/API Responses"
import axios from "axios"

export const fetchRecipeBasketState = async ({
  id,
}: {
  id: number
}): Promise<RecipeBasketState | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/basket/${id}`,
      {withCredentials: true}
    )
    // console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching products: ", error)
  }
}
