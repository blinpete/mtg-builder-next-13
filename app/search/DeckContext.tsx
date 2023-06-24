// https://react.dev/learn/scaling-up-with-reducer-and-context

import { createContext, useContext } from "react"
import { type Scry } from "./ScryfallAPI"
import { usePersistentStore } from "./usePersistentStore"
import type { PropsWithChildren } from "react"

export type Deck = {
  cards: Scry.Card[]
  addCard: (card: Scry.Card) => void
  removeCard: (id: Scry.Card["id"]) => void
  has: (id: string) => boolean
}

const DeckContext = createContext<Deck | null>(null)

export function DeckProvider({ children }: PropsWithChildren) {
  const deckID = 1

  // const [cards, setCards] = useState<Deck["cards"]>([])
  const [cards, setCards] = usePersistentStore<Deck["cards"]>({
    default: [],
    storageKey: "decks#" + deckID,
  })
  console.log("🚀 | DeckProvider | cards:", cards)

  const deck: Deck = {
    cards,

    addCard: card => {
      setCards(cards => [...cards, card])
      console.log("🚀 | DeckProvider | addCard")
    },
    removeCard: id => {
      const idx = cards.findIndex(card => card.id === id)
      setCards(cards => cards.filter((card, i) => i !== idx))
      console.log("🚀 | DeckProvider | removeCard")
    },
    has: id => cards.findIndex(card => card.id === id) !== -1,
  }

  return <DeckContext.Provider value={deck}>{children}</DeckContext.Provider>
}

export function useDeck() {
  return useContext(DeckContext)
}
