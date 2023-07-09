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

  const [added, setAdded] = useState<Map<string, CardEntry>>(new Map())
  const [updated, setUpdated] = useState<Map<string, number>>(new Map())

  const addCard = useCallback(
    (card: Card) => {
      if (!deckServer) return

      const idx = deckServer.cards.findIndex(x => x.card.id === card.id)
      if (idx !== -1) {
        setUpdated(prev => {
          const current = new Map(prev)
          current.set(card.id, (current.get(card.id) || 0) + 1)
          return current
        })
        return
      }

      setAdded(prev => {
        const current = new Map(prev)
        current.set(card.id, { card, count: (current.get(card.id)?.count || 0) + 1 })
        return current
      })
    },
    [deckServer]
  )

  const removeCard = useCallback(
    (id: string) => {
      if (!deckServer) return

      const item = added.get(id)
      if (item) {
        item.count -= 1

        if (item.count <= 0) added.delete(id)

        setAdded(new Map(added))
        return
      }

      setUpdated(prev => {
        const current = new Map(prev)
        current.set(id, (current.get(id) || 0) - 1)
        return current
      })
    },
    [deckServer, added]
  )

  const cards = useMemo(() => {
    if (!deckServer) return []

    const cards = deckServer?.cards.map(x => {
      const count = x.count + (updated.get(x.card.id) || 0)
      if (count <= 0) return null

      return { card: x.card, count }
    })

    added.forEach(item => cards.push(item))

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
