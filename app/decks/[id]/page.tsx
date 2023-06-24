"use client"

import { CardsGrid } from "@/app/search/CardsGrid"
import { useDeck } from "@/app/search/DeckContext"

export default function DeckPage() {
  const deck = useDeck()
  console.log("🚀 | deck:", deck)

  return (
    <section>
      {!deck?.cards && <div>No cards found</div>}

      {deck?.cards && (
        <>
          {/* <div>sideboard</div> */}
          <div>deck: {deck.cards.length} cards</div>
          <CardsGrid data={deck.cards} onCardClick={card => deck.removeCard(card.id)} />
        </>
      )}
    </section>
  )
}
