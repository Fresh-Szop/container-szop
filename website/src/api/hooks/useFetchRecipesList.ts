import { useQuery } from "@tanstack/react-query"
import { fetchRecipes } from "../utils/fetchRecipes"


export const useFetchRecipesList = () => {
  return useQuery({
    queryKey: ["all-recipes"],
    queryFn: () => fetchRecipes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}