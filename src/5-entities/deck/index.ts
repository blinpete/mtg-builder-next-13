// api
export { useDeckMutation } from "./api/useDeckMutation"
export { useDeckQuery } from "./api/useDeckQuery"
export { useDecksMutation } from "./api/useDecksMutation"

// model
export type { SetActiveCardAction } from "./model/activeCard"
export { DeckProvider, useDeck, type DeckContextType } from "./model/DeckContext"
export { useStoreActiveDeck, useStoreActiveDeckCardsCount } from "./model/store"
// export { useDeck } from "./model/useDeck"

// utils
export { countCards } from "./utils/countCards"
export { useCardsCounters } from "./utils/useCardsCounters"

// ui
export { DeckCover } from "./ui/DeckCover"
