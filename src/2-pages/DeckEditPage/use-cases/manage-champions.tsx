import { useCallback, useMemo } from "react"

import { useStoreActiveDeck } from "@entities/deck"
import type { Card } from "@shared/types"

type Props = {
  card: Card
}

export function ChampionsManager({ card }: Props) {
  const deckHasCard = useStoreActiveDeck(s => s.has)
  const addChampion = useStoreActiveDeck(s => s.addChampion)
  const removeChampion = useStoreActiveDeck(s => s.removeChampion)
  const champions = useStoreActiveDeck(s => s.champions)

  const isInDeck = useMemo(() => {
    if (!card?.id) return false

    return deckHasCard(card.id)
  }, [card, deckHasCard])

  const handleAddChampion = useCallback(() => {
    return addChampion(card)
  }, [card, addChampion])

  const handleRemoveChampion = useCallback(() => {
    return removeChampion(card.id)
  }, [card.id, removeChampion])

  const canAddChampion = useMemo(() => {
    return isInDeck && champions.findIndex(x => x.id === card.id) === -1
  }, [card.id, champions, isInDeck])

  const canRemoveChampion = useMemo(() => {
    return champions.findIndex(x => x.id === card.id) !== -1
  }, [card.id, champions])

  return (
    <div
      className="
        px-4 h-full
        flex gap-1 justify-center items-center
        text-sm
      "
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
