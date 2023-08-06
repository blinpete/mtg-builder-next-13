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
        my-4 list-none
        grid gap-x-1.5 gap-y-2.5
        w-fit mx-auto px-3
        grid-cols-1
        @xs:grid-cols-2
        @2xl:grid-cols-3
        @4xl:grid-cols-4
        items-end
      "
      // TODO: test and change `@xs` to `@sm`
      /**
       * TailwindCSS container queries
       *
       * release post:
       * https://tailwindcss.com/blog/tailwindcss-v3-2#container-queries
       *
       * sizes:
       * https://github.com/tailwindlabs/tailwindcss-container-queries#configuration
       *
       * mdn docs
       * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
       */
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
