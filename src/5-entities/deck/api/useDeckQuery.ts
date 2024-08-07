import { useQuery } from "react-query"

import type { DeckRecordLoaded } from "@shared/types"

export function useDeckQuery(props: { id: string | null }) {
  return useQuery<DeckRecordLoaded | undefined, unknown>({
    queryKey: ["deck", props.id],
    queryFn: async () => {
      if (props.id === null) return undefined

      const response = await fetch("/api/decks/" + props.id, {
        method: "GET",
      })

      if (!response.ok) throw response

      const res = await response.json()
      console.log("🚀 | queryFn: | res:", res)

      return res as DeckRecordLoaded
    },
  })
}
