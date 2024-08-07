import { useCallback, useMemo } from "react"

import { CardCompact } from "@entities/card"
import { sortCards } from "@shared/lib/deckUtils.client"
import type { DeckLocal } from "@shared/types"
import type { Card } from "@shared/types"

import { CardControlsPlusMinus } from "./CardControlsPlusMinus"
import { DeckSectionHeading } from "./DeckSectionHeading"

type Props = {
  deck: DeckLocal
  isActiveCard: (card: Card["id"]) => boolean
  onCardClick: (card: Card | null) => void
}

export function DeckColumn({ deck, isActiveCard, onCardClick }: Props) {
  const cardsSorted = useMemo(() => sortCards(deck.cards), [deck.cards])

  const toggleActiveCard = useCallback<Props["onCardClick"]>(
    card => {
      if (card?.id && isActiveCard(card.id)) return onCardClick(null)
      onCardClick(card)
    },
    [isActiveCard, onCardClick]
  )

  return (
    <div>
      <DeckSectionHeading title="Champions" />
      <ul
        className="
        mx-1 mt-4 mb-2 list-none
        grid gap-y-1 grid-cols-1 place-items-center
      "
      >
        {deck.champions.map(({ id }, i) => {
          const item = deck.cards.find(x => x.card.id === id)
          if (!item) return "not in deck"

          return (
            <CardCompact
              key={id + "__champion__" + i}
              card={item.card}
              onClick={() => toggleActiveCard(item.card)}
              slotLeftCorner={<span>{item.count}</span>}
              slotControls={
                !isActiveCard(item.card.id) ? null : (
                  <CardControlsPlusMinus deck={deck} card={item.card} />
                )
              }
            />
          )
        })}
      </ul>

      <DeckSectionHeading title="Deck" />
      <ul
        className="
        mx-1 mt-4 mb-6 list-none
        grid gap-y-1 grid-cols-1 place-items-center
      "
      >
        {cardsSorted.map(({ card, count }, i) => (
          <CardCompact
            key={card.id + i}
            card={card}
            onClick={() => toggleActiveCard(card)}
            slotLeftCorner={<span>{count}</span>}
            slotControls={
              !isActiveCard(card.id) ? null : <CardControlsPlusMinus deck={deck} card={card} />
            }
          />
        ))}
      </ul>
    </div>
  )
}
