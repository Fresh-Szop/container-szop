import { useQuery } from "@tanstack/react-query"

import { fetchSpecificProduct } from "@/api/utils/fetchSpecificProduct"

export const useFetchSpecificProduct = (id: number) => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchSpecificProduct({id}),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}