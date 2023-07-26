import { useQuery } from "react-query"
import type { DeckRecordLoaded } from "@/types/decks"

export function useDeckQuery(props: { id: string | null }) {
  return useQuery<DeckRecordLoaded | undefined, any>({
    queryKey: ["deck", props.id],
    queryFn: async () => {
      if (props.id === null) return undefined

      const response = await fetch("/api/decks/" + props.id, {
        method: "GET",
      })
      const res = await response.json()
      console.log("🚀 | queryFn: | res:", res)

      return res as DeckRecordLoaded
    },
  })
}
