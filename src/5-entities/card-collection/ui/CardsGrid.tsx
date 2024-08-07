import Image from "next/image"
import { useState } from "react"

import { cn } from "@shared/lib/utils"
import type { Card } from "@shared/types"

export type CardsGridProps = {
  counters?: Record<string, number>
  onCardClick?: (card: Card) => void
}

type Props = CardsGridProps & {
  data: Card[]
  cardClassName?: (card: Card) => string
  cardHeaderFn?: (card: Card, counters: CardsGridProps["counters"], visible: boolean) => JSX.Element
}

function checkIfTouchScreen() {
  // https://stackoverflow.com/questions/55833326/wrong-maxtouchpoints-and-ontouchstart-in-document-in-chrome-mobile-emulati
  // https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error: thanks IE<=10
    navigator.msMaxTouchPoints > 0
  )
}

export function CardsGrid(props: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const isTouchScreen = checkIfTouchScreen()

  return (
    <div className="@container/main w-full">
      <ul
        className="
        my-4 list-none
        grid gap-x-1.5 gap-y-2.5
        w-fit mx-auto px-3
        grid-cols-1
        @xs/main:grid-cols-2
        @2xl/main:grid-cols-3
        @4xl/main:grid-cols-4
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
            {props.cardHeaderFn &&
              props.cardHeaderFn(card, props.counters, isTouchScreen || hovered === card.id)}

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
    </div>
  )
}
