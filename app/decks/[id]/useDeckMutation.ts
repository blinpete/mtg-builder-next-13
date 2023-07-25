import { useCallback, useState } from "react"
import { useQueryClient } from "react-query"
import type { DeckContextType } from "@/app/search/DeckContext"
import type { DeckLocal, DeckRecord, DeckRecordLoaded } from "@/types/decks"

async function saveDeck(deck: DeckLocal) {
  const deckRecord: DeckRecord = {
    id: deck.id,
    name: deck.name,
    sideboard: deck.sideboard,
    createdAt: deck.createdAt,
    userId: deck.userId,
    champions: deck.champions,
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
