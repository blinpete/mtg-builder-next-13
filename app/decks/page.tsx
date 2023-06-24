"use client"

import { useQuery } from "react-query"
import type { DeckRecord } from "../api/deck/decks-json"

export default function DeckPage() {
  const { data: decks, error } = useQuery<DeckRecord[], any>({
    queryKey: ["deck"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/deck/all", {
        method: "GET",
      })
      const res = await response.json()
      return res.data
    },
  })

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | decks:", decks)

  return (
    <section>
      {error && <div>Error: {JSON.stringify(error)}</div>}

      {decks && (
        <ul>
          {decks.map(d => (
            <>
              {d.id}: {d.name} ({d.cards.length})
            </>
          ))}
        </ul>
      )}
    </section>
  )
}
