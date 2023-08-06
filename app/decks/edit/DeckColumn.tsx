import Image from "next/image"
import { cn } from "@/lib/utils"
import { CardCompact, CardCompactButton } from "./CardCompact"
import type { SetActiveCardAction } from "./page"
import type { DeckLocal } from "@/types/decks"
import type { Card } from "scryfall-sdk"

function DeckSectionHeading({ title }: { title: string }) {
  return (
    <h1 className="text-xs flex gap-2 pl-3 pr-4 items-center text-zinc-600/60">
      <hr className="flex-grow border-zinc-600/30" />
      <span>{title}</span>
      <hr className="flex-grow border-zinc-600/30" />
    </h1>
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
  return (
    <div>
      <DeckSectionHeading title="Deck" />
      <ul
        className="
        mx-1 mt-4 mb-2 list-none
        grid gap-y-1 grid-cols-1
      "
      >
        {deck.cards.map(({ card, count }, i) => (
          <CardCompact
            key={card.id + i}
            card={card}
            onClick={() => setActiveCard(prev => (prev?.id === card.id ? null : card))}
            slotLeftCorner={<span>{count}</span>}
            slotControls={
              activeCard?.id !== card.id ? null : (
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
          />
        ))}
      </ul>
    </div>
  )
}
