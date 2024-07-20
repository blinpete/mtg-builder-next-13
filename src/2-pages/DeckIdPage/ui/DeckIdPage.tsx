"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMemo, useState } from "react"
import { CardsGrid } from "@/app/search/CardsGrid"
import { useDeck } from "@/app/search/DeckContext"
import { CardDotCounter, CardPreviewPortal } from "@entities/card"
import { useDecksMutation, useDeckQuery } from "@entities/deck"
import { DeckSectionHeading } from "@features/DeckColumn"
import { sortCards } from "@shared/lib/deckUtils.client"
import type { CardEntry } from "@shared/types/decks"
import type { Card } from "scryfall-sdk"

function countCards(cards?: CardEntry[]) {
  if (!cards) return 0
  return cards.reduce((acc, x) => acc + x.count, 0)
}

export function DeckIdPage() {
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
    if (!deck || !deck?.cards) return
    return Object.fromEntries(deck.cards.map(x => [x.card.id, x.count]))
  }, [deck])

  const router = useRouter()
  const { deck: activeDeck, setDeckId } = useDeck()
  const { deleteDeck, isFetching: isMutationRunning } = useDecksMutation()

  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const cardsExceptChampions = useMemo(() => {
    const filtered = deck?.cards?.filter(
      x => deck.champions.findIndex(champion => champion.id === x.card.id) === -1
    )
    if (!filtered) return filtered

    const sorted = sortCards(filtered)

    return sorted.map(x => x.card)
  }, [deck?.cards, deck?.champions])

  const champions = useMemo(() => {
    return deck?.champions
      ?.map(champion => deck.cards.find(x => champion.id === x.card.id)?.card)
      .filter(Boolean) as Card[]
  }, [deck?.cards, deck?.champions])

  if (isFetching) return <div>Loading the deck...</div>

  if (!deck) return <div>No deck found by id: {params.id}</div>
  // if (!deck.cards.length) return <div>Empty deck</div>

  const onEdit = () => {
    setDeckId(deck.id)
    router.push("/decks/edit")
  }

  const onDelete = async () => {
    await deleteDeck(deck.id)

    if (deck.id === activeDeck?.id) {
      setDeckId("")
    }

    router.push("/decks")
  }

  if (!deck) return <div>No deck with id: {params.id} </div>

  return (
    <section className="w-full">
      {deck && (
        <div className="w-full px-4 py-3 flex flex-col items-stretch">
          <div className="flex justify-end items-center gap-1">
            {isMutationRunning && <span>Waiting for the server...</span>}
            <button
              disabled={isMutationRunning}
              className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
              onClick={() => onEdit()}
            >
              Edit
            </button>
            <button
              disabled={isMutationRunning}
              className="px-2 py-0.5 rounded-sm bg-red-500 hover:opacity-80 disabled:opacity-30"
              onClick={() => onDelete()}
            >
              Delete
            </button>
          </div>

          <div className="text-slate-700 flex flex-col items-center">
            <div className="font-semibold text-lg">{deck.name}</div>
            <p className="text-sm">
              cards: {countCards(deck.cards)}/60 deck + {countCards(deck?.sideboard)}/15 sideboard
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

      <div className="pt-2">
        <DeckSectionHeading title="Champions" />
        {champions.length ? (
          <CardsGrid
            data={champions}
            counters={counters}
            onCardClick={card => setActiveCard(card)}
            cardHeaderFn={card => (
              <CardDotCounter card={card} counters={counters} visible={false} />
            )}
          />
        ) : (
          <div className="text-center my-7 text-sm text-zinc-600/60">No champions</div>
        )}
      </div>

      <div className="pt-2">
        <DeckSectionHeading title="Deck" />
        {cardsExceptChampions?.length ? (
          <CardsGrid
            data={cardsExceptChampions}
            counters={counters}
            onCardClick={card => setActiveCard(card)}
            cardHeaderFn={card => (
              <CardDotCounter card={card} counters={counters} visible={false} />
            )}
          />
        ) : (
          <div className="text-center my-7 text-sm text-zinc-600/60">Empty deck</div>
        )}
      </div>

      {activeCard && <CardPreviewPortal card={activeCard} onClick={() => setActiveCard(null)} />}
    </section>
  )
}
