import { useCallback, useMemo } from "react"
import { useDeck } from "@entities/deck"
import type { Card } from "@entities/card"

type Props = {
  card: Card
}

export function ChampionsManager({ card }: Props) {
  const { deck } = useDeck()

  const isInDeck = useMemo(() => {
    if (!card?.id) return false
    if (!deck) return false

    return deck.has(card.id)
  }, [card, deck])

  const handleAddChampion = useCallback(() => {
    if (!deck?.addChampion) return
    return deck.addChampion(card)
  }, [deck, card])

  const handleRemoveChampion = useCallback(() => {
    if (!deck?.removeChampion) return
    return deck.removeChampion(card.id)
  }, [deck, card.id])

  const canAddChampion = useMemo(() => {
    return isInDeck && deck?.champions.findIndex(x => x.id === card.id) === -1
  }, [card.id, deck?.champions, isInDeck])

  const canRemoveChampion = useMemo(() => {
    return deck?.champions.findIndex(x => x.id === card.id) !== -1
  }, [card.id, deck?.champions])

  return (
    <div
      className="
        px-4 h-full
        flex gap-1 justify-center items-center
        text-sm
      "
      // h-[var(--preview-header-vh)]
    >
      <button
        className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
        disabled={!canAddChampion}
        onClick={e => {
          e.stopPropagation()
          handleAddChampion()
        }}
      >
        Add to champions
      </button>
      <button
        className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
        disabled={!canRemoveChampion}
        onClick={e => {
          e.stopPropagation()
          handleRemoveChampion()
        }}
      >
        Remove from champions
      </button>
    </div>
  )
}
