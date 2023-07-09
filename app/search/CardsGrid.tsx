import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Scry } from "./ScryfallAPI"

export type CardsGridProps = {
  counters?: Record<string, number>
  onCardClick?: (card: Scry.Card) => void
}

type Props = CardsGridProps & {
  data: Scry.Card[]
  cardClassName?: (card: Scry.Card) => string
  cardHeaderFn?: (
    card: Scry.Card,
    counters: CardsGridProps["counters"],
    visible: boolean
  ) => JSX.Element
}

export function CardsGrid(props: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <ul
      className="
        mx-1 my-4 list-none
        grid gap-x-1.5 gap-y-2.5
        grid-cols-2
        md:grid-cols-3
        sm:grid-cols-2
        items-end
      "
      // TODO: use Container query instead of `sm / md`
      // https://tailwindcss.com/blog/tailwindcss-v3-2#container-queries
    >
      {props.data.map((card, i) => (
        <li
          key={card.id + i}
          onMouseEnter={() => setHovered(card.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* header */}
          {props.cardHeaderFn && props.cardHeaderFn(card, props.counters, hovered === card.id)}

          {/* card */}
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
