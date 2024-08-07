import { useQuery } from "react-query"

import type { Set } from "scryfall-sdk"

export function useSetsQuery() {
  return useQuery<Set[], unknown>({
    queryKey: ["sets"],
    queryFn: async () => {
      const response = await fetch("/api/sets", { method: "GET" })

      if (!response.ok) throw response

      const res = await response.json()

      return res?.data as Set[]
    },
  })
}
