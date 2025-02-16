import { useQuery } from "@tanstack/react-query"

import { fetchSpecificRecipe } from "../utils/fetchSpecificRecipe"

export const useFetchSpecificRecipe = (id: number) => {
  return useQuery({
    queryKey: ["recipe"],
    queryFn: () => fetchSpecificRecipe({ id }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
