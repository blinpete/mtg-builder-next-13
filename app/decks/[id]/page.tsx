"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { CardsGrid } from "@/app/search/CardsGrid"
import { useDeck } from "@/app/search/DeckContext"
import { CardDotCounter } from "../edit/CardDotCounter"
import { useDeckQuery } from "./useDeckQuery"

export default function DeckPage() {
  const params = useParams()
  console.log("🚀 | DeckPage | params:", params)

  const { data: deck, error, isFetching } = useDeckQuery({ id: params.id })
  console.log("🚀 | /deck/[id] | error:", error)
  console.log("🚀 | /deck/[id] | deck:", deck)

  const counters = useMemo(() => {
    if (!deck) return
    return Object.fromEntries(deck?.cards.map(x => [x.card.id, x.count]))
  }, [deck])

  const router = useRouter()
  const { setDeckId } = useDeck()

  if (isFetching) return <div>Loading...</div>

  if (!deck) return <div>No deck found by id: {params.id}</div>
  // if (!deck.cards.length) return <div>Empty deck</div>

  const onEdit = () => {
    setDeckId(deck.id)
    router.push("/decks/edit")
  }

  return (
    <section>
      {deck && (
        <div className="w-full mx-1 my-3 flex justify-between items-center">
          <div className="font-semibold">
            {deck.name}: {deck.cards.length} cards
          </div>
          <button
            className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
            onClick={() => onEdit()}
          >
            Edit
          </button>
        </div>
      )}

      {deck.cards.length ? (
        <CardsGrid
          data={deck.cards.map(x => x.card)}
          counters={counters}
          cardHeaderFn={card => <CardDotCounter card={card} counters={counters} visible={false} />}
        />
      ) : (
        <div>Empty deck</div>
      )}
    </section>
  )
}
