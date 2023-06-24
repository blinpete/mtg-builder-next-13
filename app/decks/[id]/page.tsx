"use client"

import { useParams } from "next/navigation"
import { useQuery } from "react-query"
import { CardsGrid } from "@/app/search/CardsGrid"
import type { DeckRecordLoaded } from "@/app/api/deck/decks-json"

export default function DeckPage() {
  const params = useParams()
  console.log("🚀 | DeckPage | params:", params)

  const {
    data: deck,
    error,
    isFetching,
  } = useQuery<DeckRecordLoaded | undefined, any>({
    queryKey: ["deck"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/deck/get-by-id?id=" + params.id, {
        method: "GET",
      })
      const res = await response.json()

      return res.data as DeckRecordLoaded
    },
  })

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | deck:", deck)

  if (isFetching) return <div>Loading...</div>

  if (!deck) return <div>No deck found by id: {params.id}</div>
  if (!deck.cards.length) return <div>Empty deck</div>

  return (
    <section>
      {deck && (
        <>
          <div>deck name: {deck.name}</div>
          <div>deck: {deck.cards.length} cards</div>
        </>
      )}

      <CardsGrid data={deck.cards} onCardClick={card => deck.removeCard(card.id)} />
    </section>
  )
}
