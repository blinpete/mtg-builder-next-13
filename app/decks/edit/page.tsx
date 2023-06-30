"use client"

import Image from "next/image"
import { CardsGrid } from "@/app/search/CardsGrid"
import { useDeck } from "@/app/search/DeckContext"
import { cn } from "@/lib/utils"

export default function DeckPage() {
  const { deck } = useDeck()

  // if (isFetching) return <div>Loading...</div>
  // if (!deck) return <div>No deck found by id: {params.id}</div>

  if (!deck) return <div>Error: deck is null. This should never happen</div>
  if (!deck?.cards.length) return <div>Empty deck</div>

  return (
    <section
      className="
        border-0 border-red-500
        flex-auto flex flex-row
      "
      style={{
        maxHeight: "calc(100vh - 3rem)",
      }}
    >
      {/* sidebar */}
      <article
        className="
        bg-gray-400/40 basis-64 flex-grow-0 flex-shrink-0
        overflow-y-auto
        "
      >
        <div>title: {deck?.name}</div>
        <div>deck: {deck?.cards.length} cards</div>
        <button
          className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
          onClick={() => {
            alert("implement saveDeck")
          }}
        >
          Save
        </button>

        <ul
          className="
            mx-1 mt-4 list-none
            grid gap-x-1.5 gap-y-2.5
            grid-cols-1
          "
        >
          {deck.cards.map(({ card, count }, i) => (
            <li
              key={card.id + i}
              className="h-6 hover:h-min"
              style={{
                transition: "height 1s ease-in",
              }}
            >
              {/* <div>count: {count}</div> */}
              {card.image_uris && (
                <Image
                  className={cn("magic-card h-auto")}
                  src={card.image_uris?.normal || card.image_uris.png}
                  height={320}
                  width={240}
                  alt={card.name}
                  // onClick={() => props.onCardClick?.(card)}
                />
              )}
            </li>
          ))}
        </ul>
      </article>

      {/* grid */}
      <div>
        some random text some random text some random text some random text some random text some
        random text some random text some random text some random text some random text some random
        text some random text some random text some random text some random text some random text
        some random text some random text some random text some random text some random text some
        random text some random text some random text
      </div>
      {/* <CardsGrid
        data={deck.cards.map(x => x.card)}
        counters={deck.cards.map(x => x.count)}
        onCardClick={card => {
          if (deck.id !== deckForEdit?.id) return
          deckForEdit.removeCard(card.id)
        }}
      /> */}
    </section>
  )
}
