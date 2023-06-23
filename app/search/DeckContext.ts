// https://react.dev/learn/scaling-up-with-reducer-and-context

import { createContext } from "react"
import { type Scry } from "./ScryfallAPI"

export const DeckContext = createContext<{
  cards: Scry.Card[]
  addCard: (card: Scry.Card) => void
}>({
  cards: [],
  addCard: null,
})
