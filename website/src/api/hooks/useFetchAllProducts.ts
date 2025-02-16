import { useQuery } from "@tanstack/react-query"

import { fetchAllProducts } from "@/api/utils/fetchAllProducts"

export const useFetchAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchAllProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}