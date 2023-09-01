"use client"

import { useMemo, useState } from "react"
import { useDeck } from "@/app/search/DeckContext"
import { Input } from "@/app/search/Input"
import { SearchForm } from "@/app/search/SearchForm"
import { SearchOutput } from "@/app/search/SearchOutput"
import { CardDotCounter } from "./CardDotCounter"
import { CardPreview } from "./CardPreview"
import { DeckColumn } from "./DeckColumn"
import type { Dispatch, SetStateAction } from "react"
import type { Card } from "scryfall-sdk"

export type SetActiveCardAction = Dispatch<SetStateAction<Card | null>>

export default function DeckPage() {
  const { deck, saveDeck, setName, isSaving, dropChanges } = useDeck()

  const [query, setQuery] = useState("")
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const counters = useMemo(() => {
    if (!deck) return
    return Object.fromEntries(deck?.cards.map(x => [x.card.id, x.count]))
  }, [deck])

  const isActiveCardInDeck = useMemo(() => {
    if (!activeCard?.id) return false
    if (!counters) return false

    return !!counters[activeCard.id]
  }, [activeCard, counters])

  // if (isFetching) return <div>Loading...</div>
  if (!deck) return <div>Error: deck is null. This should never happen</div>
  // if (!deck?.cards.length) return <div>Empty deck</div>

  return (
    <div className="w-full overflow-x-scroll">
      <section
        className="
          flex-auto flex flex-row
          w-[200vw] sm:w-full
          [--layout-sidebar-w:100vw] sm:[--layout-sidebar-w:16rem]
          max-h-[--layout-main-vh]
        "
      >
        {/* sidebar */}
        <article
          className="
            bg-gray-400/40
            basis-[--layout-sidebar-w] flex-grow-0 flex-shrink-0
            overflow-y-auto
          "
        >
          <div className="p-2">
            <div className="text-sm">
              <Input
                type="text"
                name="deckname"
                className="w-full"
                onChange={e => setName(e.target.value)}
                value={deck.name}
              />
            </div>

            <div className="flex gap-1 mt-1 justify-center px-1">
              <div className="text-xs text-right px-0.5 mr-auto">
                {deck?.cards.reduce((acc, x) => acc + x.count, 0)} cards
              </div>

              <button
                className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
                disabled={!deck.hasChanged || isSaving}
                onClick={() => saveDeck()}
              >
                Save
              </button>
              <button
                className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
                disabled={!deck.hasChanged || isSaving}
                onClick={() => dropChanges()}
              >
                Cancel
              </button>
            </div>
          </div>

          <DeckColumn deck={deck} activeCard={activeCard} setActiveCard={setActiveCard} />
        </article>

        {/* Search -> Card Grid */}
        <div className="relative w-full border-0 border-red-500 box-border">
          <article
            className="flex-auto flex items-center flex-col overflow-y-auto h-full"
            style={{
              fontSize: "0.92em",
            }}
          >
            <SearchForm
              query=""
              onSubmit={e => {
                e.preventDefault()
                const target = e.target as unknown as { search: HTMLInputElement }
                const q = target?.search?.value
                if (!q) return

                setQuery(q.replaceAll(" ", "+"))
              }}
            />

            {query ? (
              <SearchOutput
                query={query}
                counters={counters}
                onCardClick={card => setActiveCard(card)}
                cardHeaderFn={(card, counters, visible) => (
                  <CardDotCounter
                    card={card}
                    counters={counters}
                    addCard={deck.addCard}
                    removeCard={deck.removeCard}
                    visible={visible}
                  />
                )}
              />
            ) : (
              <div>Empty query</div>
            )}

            {/* overlay */}
            {activeCard && (
              <CardPreview
                showChampionButtons={true}
                height="var(--layout-main-vh)"
                isInDeck={isActiveCardInDeck}
                card={activeCard}
                onClick={() => setActiveCard(null)}
              />
            )}
          </article>
        </div>
      </section>
    </div>
  )
}
