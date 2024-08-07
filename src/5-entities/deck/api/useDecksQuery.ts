import { useQuery } from "react-query"

import type { DeckRecord } from "@shared/types"

export function useDecksQuery() {
  return useQuery<DeckRecord[], unknown>({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await fetch("/api/decks", {
        method: "GET",
        cache: "no-cache",
      })
      const res = await response.json()
      console.log("🚀 GET decks | queryFn: | res:", res)

      return res
    },
  })
}
