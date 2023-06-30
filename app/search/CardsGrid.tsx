import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Scry } from "./ScryfallAPI"

export function CardsGrid(props: {
  data: Scry.Card[]
  counters?: Record<string, number>
  cardClassName?: (card: Scry.Card) => string
  onCardClick?: (card: Scry.Card) => void
}) {
  return (
    <ul
      className="
        mx-1 mt-4 list-none
        grid gap-x-1.5 gap-y-2.5
        grid-cols-2
        md:grid-cols-4
        sm:grid-cols-3
      "
    >
      {props.data.map((card, i) => (
        <li key={card.id + i}>
          {props.counters && <div>count: {props.counters?.[card.id] || 0}</div>}
          {card.image_uris && (
            <Image
              className={cn("magic-card h-auto", props.cardClassName?.(card))}
              src={card.image_uris?.normal || card.image_uris.png}
              height={320}
              width={240}
              alt={card.name}
              onClick={() => props.onCardClick?.(card)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
