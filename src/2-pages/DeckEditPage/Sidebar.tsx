"use client"

import { DeckColumn } from "@features/DeckColumn"
import { useStoreActiveCard } from "@entities/card"
import { useDeck, useStoreActiveDeck } from "@entities/deck"
import { Input } from "@shared/ui"

type Props = {
  className?: string
}

export function Sidebar({ className }: Props) {
  // const name = useStoreActiveDeck(s => s.name)
  const setName = useStoreActiveDeck(s => s.setName)

  const isActiveCard = useStoreActiveCard(s => s.isActiveCard)
  const setActiveCard = useStoreActiveCard(s => s.setCard)

  const { deck, isSaving, saveDeck, dropChanges } = useDeck()

  if (!deck) return <div>Deck not found</div>

  return (
    <article className={className}>
      <div className="p-2">
        <div className="text-sm">
          <Input
            type="text"
            name="deckname"
            className="w-full"
            onChange={e => setName(e.target.value)}
            value={deck.name}
          />
        </div>

        <div className="flex gap-1 mt-1 justify-center px-1">
          <div className="text-xs text-right px-0.5 mr-auto">{deck.cardsCount} cards</div>

          <button
            className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
            disabled={isSaving}
            onClick={() => saveDeck()}
          >
            Save
          </button>
          <button
            className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
            disabled={isSaving}
            onClick={() => dropChanges()}
          >
            Cancel
          </button>
        </div>
      </div>

      <DeckColumn deck={deck} isActiveCard={isActiveCard} onCardClick={setActiveCard} />
    </article>
  )
}
