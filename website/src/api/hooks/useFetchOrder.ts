import { useQuery } from "@tanstack/react-query"
import { fetchOrder } from "../utils/fetchOrder"

export const useFetchOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
