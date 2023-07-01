import Image from "next/image"
import { cn } from "@/lib/utils"
import type { DeckLocal } from "@/app/search/DeckContext"
import type { Card } from "scryfall-sdk"

export function DeckColumn({
  deck,
  activeCard,
  setActiveCard,
}: {
  deck: DeckLocal
  activeCard: Card | null
  setActiveCard: (card: Card | null) => void
}) {
  return (
    <ul
      className="
        mx-1 mt-4 mb-2 list-none
        grid gap-y-1 grid-cols-1
      "
    >
      {deck.cards.map(({ card, count }, i) => (
        <li
          key={card.id + i}
          className="relative"
          onMouseEnter={() => {
            console.log("mouse enter! card:", card)
            setActiveCard(card)
          }}
          onMouseLeave={() => setActiveCard(null)}
        >
          <div
            className="
              absolute -top-1 -left-0.5
              bg-black text-stone-300
              w-4 h-4 rounded-full font-bold
              flex items-center justify-center
            "
            style={{ fontSize: "0.6rem" }}
          >
            {count}
          </div>
          <div
            className="h-11 overflow-hidden w-max"
            style={{
              borderBottom: "solid 0.6rem black",
              borderRadius: "0.6rem",
            }}
          >
            {card.image_uris && (
              <Image
                className={cn("magic-card h-auto w-full")}
                src={card.image_uris?.normal || card.image_uris.png}
                height={320}
                width={240}
                alt={card.name}
                // onClick={() => props.onCardClick?.(card)}
              />
            )}

            {activeCard?.id === card.id && (
              <div
                className="
                  bg-rose-400/80
                  absolute
                  top-0 bottom-1 left-1 right-2
                  rounded-full
                  flex gap-0.5 justify-end
                  pr-10
                "
                style={{
                  background: "radial-gradient(rgba(0 0 0 / 10%) 10%, black)",
                }}
              >
                <button
                  className="
                    bg-black text-gray-200 font-bold
                    w-8 h-3/4 rounded-t-none rounded-md
                    hover:h-4/5
                  "
                  onClick={() => deck.removeCard(card.id)}
                >
                  -
                </button>
                <button
                  className="
                    bg-black text-gray-200 font-bold
                    w-8 h-3/4 rounded-t-none rounded-md
                    hover:h-4/5
                  "
                  onClick={() => deck.addCard(card)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
