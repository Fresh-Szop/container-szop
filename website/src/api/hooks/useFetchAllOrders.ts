import { useQuery } from "@tanstack/react-query"
import { fetchAllOrders } from "../utils/fetchAllOrders"

export const useFetchAllOrders = () => {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: () => fetchAllOrders(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
