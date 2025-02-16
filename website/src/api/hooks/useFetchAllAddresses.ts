import { useQuery } from "@tanstack/react-query"
import { fetchAllAddresses } from "../utils/fetchAllAddresses"

export const useFetchAllAddresses = () => {
  return useQuery({
    queryKey: ["all-addresses"],
    queryFn: () => fetchAllAddresses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
