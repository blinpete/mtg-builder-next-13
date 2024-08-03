"use client"

import { useMemo, useState } from "react"
import { CardDotCounter, CardPreview } from "@entities/card"
import { useDeck, useStoreActiveDeck } from "@entities/deck"
import { DeckColumn } from "@features/DeckColumn"
import { SearchForm } from "@features/Search"
import { SearchOutput } from "@features/Search"
import { Input } from "@shared/ui"
import type { Card } from "scryfall-sdk"

export function DeckEditPage() {
  const { deck, dropChanges, saveDeck, isSaving } = useDeck()

  const setName = useStoreActiveDeck(state => state.setName)

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
    <div className="flex-grow w-full overflow-x-auto snap-x snap-mandatory">
      <section
        className="
          flex-auto flex flex-row
          w-[200vw] sm:w-full
          [--layout-sidebar-w:100vw] sm:[--layout-sidebar-w:16rem]
          max-h-[--layout-main-vh] min-h-[--layout-main-vh]
        "
      >
        {/* sidebar */}
        <article
          className="
            bg-gray-400/40
            basis-[--layout-sidebar-w] flex-grow-0 flex-shrink-0
            overflow-y-auto
            snap-start
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
              <div className="text-xs text-right px-0.5 mr-auto">{deck.cardsCount} cards</div>

              <button
                className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
                disabled={isSaving}
                onClick={() => saveDeck()}
              >
                Save
              </button>
              <button
                className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
                disabled={isSaving}
                onClick={() => dropChanges()}
              >
                Cancel
              </button>
            </div>
          </div>

          <DeckColumn deck={deck} activeCard={activeCard} setActiveCard={setActiveCard} />
        </article>

        {/* Search -> Card Grid */}
        <div className="relative w-full box-border snap-start">
          <article
            className="flex-auto overflow-y-auto h-full"
            style={{
              fontSize: "0.92em",
            }}
          >
            <div
              className="
              flex items-center flex-col
              max-w-[--layout-main-content-max-w] mx-auto
            "
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
            </div>

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
