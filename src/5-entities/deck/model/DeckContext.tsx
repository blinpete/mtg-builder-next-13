import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import {
  useDeckMutation,
  useDeckQuery,
  useStoreActiveDeck,
  useStoreActiveDeckCardsCount,
} from "@entities/deck"
import type { DeckLocal } from "@shared/types"

import type { PropsWithChildren } from "react"

export type DeckContextType = {
  deck: DeckLocal | null
  isFetching: boolean
  error: unknown

  setDeckId: (id: string) => void

  isSaving: boolean
  saveDeck: () => void

  dropChanges: (props?: { dropName: boolean }) => void
}
// @ts-expect-error: damn contexts
const DeckContext = createContext<DeckContextType>(null)

export function DeckProvider({ children }: PropsWithChildren) {
  // --------------------------------------------------------------
  //                         server deck
  // --------------------------------------------------------------
  const [deckId, setDeckId] = useState<string | null>(null)
  const { data: deckServer, error, isFetching } = useDeckQuery({ id: deckId })
  console.log("🚀 | DeckProvider | deckServer:", deckServer)

  // --------------------------------------------------------------
  //                         deck store
  // --------------------------------------------------------------
  const deckStore = useStoreActiveDeck()
  console.log("🚀 | DeckProvider | deckStore:", deckStore)

  const setInitialState = useCallback(() => {
    if (!deckServer) return

    deckStore.setName(deckServer.name)
    deckStore.setCards(deckServer.cards)
    deckStore.setChampions(deckServer.champions)

    console.log("🚀 DeckContext | useEffect | deckStore:", deckStore)
    // deckStore shouldn't be in deps!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckServer])

  useEffect(() => {
    setInitialState()
  }, [setInitialState])

  const cardsCount = useStoreActiveDeckCardsCount()

  // --------------------------------------------------------------
  //               DeckLocal: server deck + deck store
  // --------------------------------------------------------------
  const deck = useMemo(() => {
    if (!deckServer) return null

    const deck: DeckLocal = {
      ...(deckServer || {}),
      ...deckStore,
      cards: [...deckStore.cards.values()],
      cardsCount,
    }

    return deck
  }, [deckServer, deckStore, cardsCount])

  // --------------------------------------------------------------
  //                         deck mutation
  // --------------------------------------------------------------
  const { isFetching: isSaving, saveDeck } = useDeckMutation({ deck, dropChanges: setInitialState })

  return (
    <DeckContext.Provider
      value={{
        deck,
        error,
        isFetching,
        setDeckId,
        dropChanges: setInitialState,

        isSaving,
        saveDeck,
      }}
    >
      {children}
    </DeckContext.Provider>
  )
}

export function useDeck() {
  return useContext(DeckContext)
}
