import { useQuery } from "@tanstack/react-query"
import { fetchAllSubscriptions } from "../utils/fetchAllSubscriptions"

export const useFetchAllSubscriptions = () => {
  return useQuery({
    queryKey: ["all-subscriptions"],
    queryFn: () => fetchAllSubscriptions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
