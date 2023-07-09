import { useCallback, useState } from "react"
import { useQueryClient } from "react-query"
import type { DeckRecord, DeckRecordLoaded } from "@/app/api/deck/decks-json"
import type { DeckLocal } from "@/app/search/DeckContext"

async function saveDeck(deck: DeckLocal) {
  const deckRecord: DeckRecord = {
    id: deck.id,
    name: deck.name,
    cards: deck.cards.map(x => [x.card.id, x.count]),
  }
  console.log("🚀 | saveDeck | deckRecord:", deckRecord)

  const response = await fetch("http://localhost:3000/api/deck/save", {
    method: "PATCH",
    body: JSON.stringify(deckRecord),
  })
  const res = await response.json()
  return res
}

export function useDeckMutation({
  deck,
  dropChanges,
}: {
  deck: DeckLocal | null
  dropChanges: () => void
}) {
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
          dropChanges()

          const deckUpdated: DeckRecordLoaded = {
            id: deck.id,
            name: deck.name,
            cards: deck.cards,
          }
          queryClient.setQueryData(["deck", deck.id], deckUpdated)

          // queryClient.invalidateQueries(["deck", deck.id])
        })
        .finally(() => setIsFetching(false))
    }, [deck, queryClient, dropChanges]),
  }
}
