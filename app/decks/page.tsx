"use client"

import { useQuery } from "react-query"
import { useDeck } from "../search/DeckContext"
import type { DeckRecord } from "../api/deck/decks-json"

export default function DeckPage() {
  const { data: decks, error } = useQuery<DeckRecord[], any>({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/deck/all", {
        method: "GET",
      })
      const res = await response.json()
      return res.data
    },
  })

  const { setDeckId } = useDeck()

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | decks:", decks)

  return (
    <section>
      {error && <div>Error: {JSON.stringify(error)}</div>}

      {decks && (
        <ul>
          {decks.map(d => (
            <li
              key={"decks_" + d.id}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setDeckId(d.id)}
            >
              {d.id}: {d.name} ({d.cards.length})
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}