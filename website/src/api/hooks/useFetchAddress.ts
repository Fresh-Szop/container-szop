import { useQuery } from "@tanstack/react-query"
import { fetchAddress } from "../utils/fetchAddress"

export const useFetchAddress = (name: string) => {
  return useQuery({
    queryKey: ["address", name],
    queryFn: () => fetchAddress(name),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
