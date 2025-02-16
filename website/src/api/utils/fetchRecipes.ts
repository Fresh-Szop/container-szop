import { Recipes } from "@/types/API Responses"
import axios from "axios"


export const fetchRecipes = async (): Promise<Recipes | undefined> => {
  try {
    // Wyślij żądanie do endpointu z tymi samymi parametrami
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY}/recipes`,
    )
    return response.data
  } catch (error) {
    console.error("Error fetching products: ", error)
  }
}
