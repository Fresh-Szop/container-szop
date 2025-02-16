import { useQuery } from "@tanstack/react-query"
import { fetchRecipeBasketState } from "../utils/fetchRecipeBasketState"


export const useFetchRecipeBasketState = (id: number) => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => fetchRecipeBasketState({id}),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  })
}