"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { CardsGrid } from "@/app/search/CardsGrid"
import { useDeck } from "@/app/search/DeckContext"
import { CardDotCounter } from "../edit/CardDotCounter"
import { useDeckQuery } from "./useDeckQuery"

export default function DeckPage({ params }: { params: { name: string } }) {
  const { status } = useSession()

  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return <p>You are not logged in</p>

  return <Deck />
}

function Deck() {
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

  if (isFetching) return <div>Loading the deck...</div>

  if (!deck) return <div>No deck found by id: {params.id}</div>
  // if (!deck.cards.length) return <div>Empty deck</div>

  const onEdit = () => {
    setDeckId(deck.id)
    router.push("/decks/edit")
  }

  return (
    <section>
      {deck && (
        <div className="w-full px-1 py-3 flex flex-col items-center">
          <div className="w-full flex justify-end items-center">
            <button
              className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
              onClick={() => onEdit()}
            >
              Edit
            </button>
          </div>
          <div className="text-slate-700 flex flex-col items-center">
            <div className="font-semibold text-lg">{deck.name}</div>
            <p className="text-sm">
              cards: {deck.cards.length}/60 deck + {deck?.sideboard?.length}/15 sideboard
            </p>
            <p className="text-sm">
              Created at:{" "}
              {deck?.createdAt &&
                new Date(deck.createdAt).toLocaleDateString("en", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  weekday: "short",
                })}
            </p>

            {/* <p>Cards: {deck.cards.length}</p>
            <p>Sideboard: {deck?.sideboard?.length}/15</p> */}
          </div>
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
