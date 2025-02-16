import { useQuery } from "@tanstack/react-query"
import { fetchSubscription } from "../utils/fetchSubscription"

export const useFetchSubscription = (id: number) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: () => fetchSubscription(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
