// https://react.dev/learn/scaling-up-with-reducer-and-context

import { createContext, useContext, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useDeckQuery } from "../decks/[id]/useDeckQuery"
import { type Scry } from "./ScryfallAPI"
import type { DeckRecordLoaded } from "../api/deck/decks-json"
import type { PropsWithChildren } from "react"

export type DeckLocal = {
  id: string
  name: string

  cards: {
    card: Scry.Card
    count: number
  }[]
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

  const queryClient = useQueryClient()

  let deck: DeckLocal | null = null
  if (deckServer)
    deck = {
      ...deckServer,

      addCard: card => {
        queryClient.setQueryData<DeckRecordLoaded | null>(["deck", deckId], oldData => {
          if (!oldData) {
            console.log("🚀 | addCard: no oldData!")
            return null
          }
          const cards = [...oldData.cards]
          const found = cards.find(x => x.card.id === card.id)
          if (found) {
            if (found.count >= 4)
              console.warn(
                `Warning: Adding "${card.name}" might be a mistake. There are already ${found.count} copies of the card in the deck.`
              )
            found.count += 1
          } else {
            cards.push({ card, count: 1 })
          }

          const newData = { ...oldData, cards }
          return newData
        })
      },

      removeCard: id => {
        queryClient.setQueryData<DeckRecordLoaded | null>(["deck", deckId], oldData => {
          if (!oldData) {
            console.log("🚀 | removeCard: no oldData!")
            return null
          }

          const cards = [...oldData.cards]
          const idx = cards.findIndex(x => x.card.id === card.id)
          if (idx === -1) return oldData

          if (cards[idx].count <= 0) {
            console.warn(
              `Warning: Removing "${cards[idx].card.name}" might be a mistake. There are already ${cards[idx].count} copies of the card in the deck.`
            )
          }
          cards[idx].count -= 1

          const newData = { ...oldData, cards }
          return newData
        })
      },

      has: id => !!cards[id]?.count,
    }

  return <DeckContext.Provider value={{ deck, setDeckId }}>{children}</DeckContext.Provider>
}

export function useDeck() {
  return useContext(DeckContext)
}
