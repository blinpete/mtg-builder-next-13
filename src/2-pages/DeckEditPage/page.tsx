"use client"

import { useMemo } from "react"
import { useStoreActiveCard } from "@entities/card"
import { CardPreview } from "@entities/card"
import { useCardsCounters, useDeck } from "@entities/deck"
import { Main } from "./Main"
import { Sidebar } from "./Sidebar"

export function DeckEditPage() {
  const { deck } = useDeck()

  const activeCard = useStoreActiveCard(s => s.card)
  const setActiveCard = useStoreActiveCard(s => s.setCard)

  const counters = useCardsCounters(deck?.cards)

  const isActiveCardInDeck = useMemo(() => {
    if (!activeCard?.id) return false
    if (!counters) return false

    return !!counters[activeCard.id]
  }, [activeCard, counters])

  if (!deck) return <div>Error: deck is null. This should never happen</div>

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
        <Sidebar
          className="
            bg-gray-400/40
            basis-[--layout-sidebar-w] flex-grow-0 flex-shrink-0
            overflow-y-auto
            snap-start
          "
        />

        {/* Search -> Card Grid */}
        <div className="relative w-full box-border snap-start">
          <article
            className="flex-auto overflow-y-auto h-full"
            style={{
              fontSize: "0.92em",
            }}
          >
            {/* main */}
            <Main className="max-w-[--layout-main-content-max-w] mx-auto" />

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
