import { useCallback, useState } from "react"
import { useQueryClient } from "react-query"
import type { DeckRecord } from "@/types/decks"
import type { ErrorJSON } from "@/types/errors"

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

/**
 * Decks mutation
 * ---
 *
 * - add/remove a `deck`
 */
export function useDecksMutation({ decks }: { decks?: DeckRecord[] }) {
  const queryClient = useQueryClient()

  const [isFetching, setIsFetching] = useState(false)
  // const [error, setError] = useState(null)

  return {
    isFetching,
    addDeck: useCallback(async () => {
      if (!decks) return Error("No decks to mutate")

      setIsFetching(true)
      const deck = await addDeck()
      setIsFetching(false)

      if (deck instanceof Error) {
        return deck
      }

      queryClient.setQueryData(["decks"], [...decks, deck])
      return deck
    }, [decks, queryClient]),
  }
}
