"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

import { LayoutMain } from "@widgets/LayoutMain"
import { AuthGuard } from "@features/AuthGuard"
import { DeckSectionHeading } from "@features/DeckColumn"
import { CardDotCounter, CardPreviewPortal, useStoreActiveCard } from "@entities/card"
import { CardsGrid } from "@entities/card-collection"
import {
  useDecksMutation,
  useDeck,
  countCards,
  useCardsCounters,
  useDeckQuery,
  useChampions,
} from "@entities/deck"

export function DeckIdPage() {
  return (
    <LayoutMain>
      <AuthGuard>
        <Page />
      </AuthGuard>
    </LayoutMain>
  )
}

function Page() {
  const params = useParams()
  console.log("🚀 | DeckPage | params:", params)

  const { data: deck, error, isFetching } = useDeckQuery({ id: params.id })
  console.log("🚀 | /deck/[id] | error:", error)
  console.log("🚀 | /deck/[id] | deck:", deck)

  const router = useRouter()
  const { deck: activeDeck, setDeckId } = useDeck()
  const { deleteDeck, isFetching: isMutationRunning } = useDecksMutation()

  const activeCard = useStoreActiveCard(s => s.card)
  const setActiveCard = useStoreActiveCard(s => s.setCard)
  // drop activeCard state from other pages
  useEffect(() => setActiveCard(null), [setActiveCard])

  const counters = useCardsCounters(deck?.cards)
  const { champions, cardsExceptChampions } = useChampions(deck)

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
