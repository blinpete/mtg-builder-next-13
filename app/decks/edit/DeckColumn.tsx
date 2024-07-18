import { useMemo } from "react"
import { sortCards } from "@shared/lib/deckUtils.client"
import { CardCompact, CardCompactButton } from "./CardCompact"
import type { SetActiveCardAction } from "./page"
import type { DeckLocal } from "@shared/types/decks"
import type { Card } from "scryfall-sdk"

export function DeckSectionHeading({ title }: { title: string }) {
  return (
    <h1 className="text-xs flex gap-2 pl-3 pr-4 items-center text-zinc-600/60">
      <hr className="flex-grow border-zinc-600/30" />
      <span>{title}</span>
      <hr className="flex-grow border-zinc-600/30" />
    </h1>
  )
}

function CardControlsPlusMinus({ deck, card }: { deck: DeckLocal; card: Card }) {
  return (
    <div
      className="
        absolute top-0 bottom-1 left-1 right-2
        rounded-full pr-10
        flex gap-0.5 justify-end
      "
      style={{
        background: "radial-gradient(rgba(0 0 0 / 10%) 10%, black)",
      }}
    >
      <CardCompactButton
        onClick={() => {
          deck.removeCard(card.id)
        }}
      >
        -
      </CardCompactButton>
      <CardCompactButton
        onClick={() => {
          deck.addCard(card)
        }}
      >
        +
      </CardCompactButton>
    </div>
  )
}

export function DeckColumn({
  deck,
  activeCard,
  setActiveCard,
}: {
  deck: DeckLocal
  activeCard: Card | null
  setActiveCard: SetActiveCardAction
}) {
  const cardsSorted = useMemo(() => sortCards(deck.cards), [deck.cards])

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
              onClick={() => setActiveCard(prev => (prev?.id === item.card.id ? null : item.card))}
              slotLeftCorner={<span>{item.count}</span>}
              slotControls={
                activeCard?.id !== item.card.id ? null : (
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
            onClick={() => setActiveCard(prev => (prev?.id === card.id ? null : card))}
            slotLeftCorner={<span>{count}</span>}
            slotControls={
              activeCard?.id !== card.id ? null : <CardControlsPlusMinus deck={deck} card={card} />
            }
          />
        ))}
      </ul>
    </div>
  )
}
