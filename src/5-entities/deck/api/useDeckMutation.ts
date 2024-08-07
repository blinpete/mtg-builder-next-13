import { useCallback, useState } from "react"
import { useQueryClient } from "react-query"

import type { DeckContextType } from "@entities/deck"
import { deckLoadedToRecord } from "@shared/lib/deckUtils.client"
import type { DeckLocal, DeckRecord, DeckRecordLoaded } from "@shared/types"

async function saveDeck(deck: DeckLocal) {
  const deckRecord: DeckRecord = {
    id: deck.id,
    name: deck.name,
    createdAt: deck.createdAt,
    userId: deck.userId,
    champions: deck.champions,
    // sideboard: deck.sideboard,
    // cards: deck.cards.map(x => [x.card.id, x.count]),
    ...deckLoadedToRecord(deck),
  }
  console.log("🚀 | saveDeck | deckRecord:", deckRecord)

  const response = await fetch("/api/decks/", {
    method: "PATCH",
    body: JSON.stringify(deckRecord),
  })
  console.log("🚀 | saveDeck | response:", response)

  if (response.ok) {
    // const updatedDeck = await response.json()
    return true
  }
  return false
}

/**
 * Deck mutation
 * ---
 *
 * - add/remove a new card
 * - change existing card counters
 * - change champions
 * - change sideboard
 * - change name
 */
export function useDeckMutation({
  deck,
  dropChanges,
}: Pick<DeckContextType, "deck" | "dropChanges">) {
  const queryClient = useQueryClient()

  const [isFetching, setIsFetching] = useState(false)
  // const [error, setError] = useState(null)

  return {
    isFetching,
    saveDeck: useCallback(async () => {
      if (!deck) return Error("No deck to save")

      setIsFetching(true)
      saveDeck(deck)
        .then(() => {
          const deckUpdated: DeckRecordLoaded = {
            ...deck,
            cards: deck.cards,
          }

          queryClient.setQueryData(["deck", deck.id], deckUpdated)
          // queryClient.invalidateQueries(["deck", deck.id])

          queryClient.refetchQueries({ queryKey: ["decks"] })

          dropChanges({ dropName: false })
        })
        .finally(() => setIsFetching(false))
    }, [deck, queryClient, dropChanges]),
  }
}
