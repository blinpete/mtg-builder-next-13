// https://react.dev/learn/scaling-up-with-reducer-and-context

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useDeckQuery } from "../decks/[id]/useDeckQuery"
import { type Scry } from "./ScryfallAPI"
import type { DeckRecordLoaded } from "../api/deck/decks-json"
import type { PropsWithChildren } from "react"
import type { Card } from "scryfall-sdk"

type CardEntry = {
  card: Scry.Card
  count: number
}

export type DeckLocal = {
  id: string
  name: string
  cards: CardEntry[]

  has: (id: string) => boolean
  addCard: (card: Scry.Card) => void
  removeCard: (id: Scry.Card["id"]) => void
}

const DeckContext = createContext<{
  deck: DeckLocal | null
  setDeckId: (id: string) => void
}>(null as any)

export function DeckProvider({ children }: PropsWithChildren) {
  const [deckId, setDeckId] = useState<string | null>(null)

  const { data: deckServer, error, isFetching } = useDeckQuery({ id: deckId })
  console.log("🚀 | DeckProvider | deckServer:", deckServer)

  const [added, setAdded] = useState<Record<string, CardEntry>>({})
  const [updated, setUpdated] = useState<Record<string, number>>({})

  const addCard = useCallback(
    (card: Card) => {
      if (!deckServer) return

      const idx = deckServer.cards.findIndex(x => x.card.id === card.id)
      if (idx !== -1) {
        setUpdated(prev => ({
          ...prev,
          [card.id]: (prev[card.id] || 0) + 1,
        }))
        return
      }

      setAdded(prev => ({
        ...prev,
        [card.id]: { card, count: (prev[card.id]?.count || 0) + 1 },
      }))
    },
    [deckServer]
  )

  const removeCard = useCallback(
    (id: string) => {
      if (!deckServer) return

      if (added[id]) {
        added[id].count -= 1
        setAdded({ ...added })

        if (added[id].count <= 0) {
          delete added[id]
          setAdded({ ...added })
        }
        return
      }

      setUpdated(prev => ({
        ...prev,
        [id]: (prev[id] || 0) - 1,
      }))
    },
    [deckServer, added]
  )

  const cards = useMemo(() => {
    if (!deckServer) return []

    const cards = deckServer?.cards.map(x => {
      const count = x.count + (updated[x.card.id] || 0)
      if (count <= 0) return null

      return { card: x.card, count }
    })

    for (const k in added) {
      cards.push(added[k])
    }

    return cards?.filter(Boolean) as CardEntry[]
  }, [deckServer, added, updated])

  const has = useCallback((id: string) => !!cards.find(x => x.card.id === id), [cards])

  const deck: DeckLocal | null = useMemo(() => {
    if (!deckServer) return null

    return {
      ...(deckServer || {}),
      cards,
      addCard,
      removeCard,
      has,
    }
  }, [deckServer, cards, addCard, removeCard, has])

  return <DeckContext.Provider value={{ deck, setDeckId }}>{children}</DeckContext.Provider>
}

export function useDeck() {
  return useContext(DeckContext)
}
