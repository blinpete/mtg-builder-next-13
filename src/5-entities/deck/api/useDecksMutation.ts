import { useCallback, useState } from "react"
import { useQueryClient } from "react-query"

import type { ErrorJSON, DeckRecord } from "@shared/types"

async function addDeck() {
  const response = await fetch("/api/decks", {
    method: "POST",
    cache: "no-cache",
  })

  if (response.ok) {
    const deck = (await response.json()) as DeckRecord | ErrorJSON
    if ("error" in deck) {
      return new Error(`NextError: ${deck.error}`)
    }

    console.log("🚀 | addDeck | deck:", deck)
    return deck
  } else {
    return new Error(`Unknown error: ${response.body}`)
  }
}

async function deleteDeck(id: DeckRecord["id"]) {
  const response = await fetch("/api/decks/" + id, {
    method: "DELETE",
    cache: "no-cache",
  })

  if (response.ok && response.status === 204) {
    return true
  } else {
    return new Error(`Unknown error: ${response}`)
  }
}

/**
 * Decks mutation
 * ---
 *
 * - add/remove a `deck`
 */
export function useDecksMutation() {
  const queryClient = useQueryClient()

  const [isFetching, setIsFetching] = useState(false)
  // const [error, setError] = useState(null)

  return {
    isFetching,
    addDeck: useCallback(async () => {
      const decks = queryClient.getQueryData<DeckRecord[]>(["decks"])

      if (!decks) return Error("No decks to mutate")

      setIsFetching(true)
      const deck = await addDeck()
      setIsFetching(false)

      if (deck instanceof Error) {
        return deck
      }

      queryClient.setQueryData(["decks"], [...decks, deck])
      return deck
    }, [queryClient]),

    deleteDeck: useCallback(
      async (id: DeckRecord["id"]) => {
        const decks = queryClient.getQueryData<DeckRecord[]>(["decks"])
        if (!decks) return Error("No decks to mutate")

        setIsFetching(true)
        const response = await deleteDeck(id)
        setIsFetching(false)

        if (response instanceof Error) {
          console.log("🚀 deleteDeck | error:", response)
          return response
        }

        queryClient.setQueryData(
          ["decks"],
          decks.filter(deck => deck.id !== id)
        )
        return true
      },
      [queryClient]
    ),
  }
}
