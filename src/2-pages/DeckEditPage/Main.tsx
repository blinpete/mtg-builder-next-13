"use client"

import { SearchForm, SearchOutput, useStoreSearchQuery } from "@features/Search"
import { CardDotCounter } from "@entities/card"
import { useStoreActiveCard } from "@entities/card"
import { useCardsCounters, useStoreActiveDeck } from "@entities/deck"
import { cn } from "@shared/lib/utils"

type Props = {
  className?: string
}

export function Main({ className }: Props) {
  const setActiveCard = useStoreActiveCard(s => s.setCard)
  const deckAddCard = useStoreActiveDeck(s => s.addCard)
  const deckRemoveCard = useStoreActiveDeck(s => s.removeCard)

  const deckCards = useStoreActiveDeck(s => [...s.cards.values()])
  const counters = useCardsCounters(deckCards)

  const query = useStoreSearchQuery(s => s.query)
  const setQuery = useStoreSearchQuery(s => s.setQuery)

  return (
    <div className={cn("flex items-center flex-col", className)}>
      <SearchForm
        query={query}
        onSubmit={e => {
          e.preventDefault()
          const target = e.target as unknown as { search: HTMLInputElement }
          const q = target?.search?.value
          if (!q) return

          setQuery(q)
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
              addCard={deckAddCard}
              removeCard={deckRemoveCard}
              visible={visible}
            />
          )}
        />
      ) : (
        <div>Empty query</div>
      )}
    </div>
  )
}
