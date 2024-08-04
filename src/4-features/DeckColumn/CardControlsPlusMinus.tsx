import { CardCompactButton } from "@entities/card"
import type { DeckLocal } from "@shared/types"
import type { Card } from "@shared/types"

export function CardControlsPlusMinus({ deck, card }: { deck: DeckLocal; card: Card }) {
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
