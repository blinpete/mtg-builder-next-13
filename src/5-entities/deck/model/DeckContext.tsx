// https://react.dev/learn/scaling-up-with-reducer-and-context

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useDeckMutation, useDeckQuery } from "@entities/deck"
import { useEffectEventCustom } from "../../../../app/search/useEffectEventCustom"
import type { CardEntry, DeckLocal, DeckRecord } from "@shared/types/decks"
import type { PropsWithChildren } from "react"
import type { Card } from "scryfall-sdk"

function hashChampions(champions: DeckRecord["champions"]): string {
  return champions.reduce((acc, x) => acc + "__" + x.id, "")
}

export type DeckContextType = {
  deck: DeckLocal | null
  isSaving: boolean
  isFetching: boolean
  error: any

  setDeckId: (id: string) => void
  saveDeck: () => void
  dropChanges: (props?: { dropName: boolean }) => void

  setName: (name: string) => void
}
const DeckContext = createContext<DeckContextType>(null as any)

export function DeckProvider({ children }: PropsWithChildren) {
  const [deckId, setDeckId] = useState<string | null>(null)

  const { data: deckServer, error, isFetching } = useDeckQuery({ id: deckId })
  console.log("🚀 | DeckProvider | deckServer:", deckServer)

  const [added, setAdded] = useState<Map<string, CardEntry>>(new Map())
  const [updated, setUpdated] = useState<Map<string, number>>(new Map())
  const [name, setName] = useState(deckServer?.name || "")

  useEffect(() => {
    setName(prev => prev || deckServer?.name || "")
  }, [deckServer?.name])

  // const setDeckServerName = experimental_useEffectEvent(() => setName(deckServer?.name || ""))
  const setDeckServerName = useEffectEventCustom(() => setName(deckServer?.name || ""))

  // prevents data leaking from deck to deck
  useEffect(() => {
    setDeckServerName()
    dropChanges({ dropName: false })

    // `setDeckServerName` isn't in deps, cuz "effect events" are not reactive
    // https://react.dev/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId])

  const dropChanges = useCallback(
    ({ dropName } = { dropName: true }) => {
      setAdded(new Map())
      setUpdated(new Map())

      setChampions(deckServer?.champions || [])

      if (dropName) {
        setName(deckServer?.name || "")
      }
    },
    [deckServer?.champions, deckServer?.name]
  )

  const addCard = useCallback(
    (card: Card) => {
      if (!deckServer) return

      const idx = deckServer.cards.findIndex(x => x.card.id === card.id)
      if (idx !== -1) {
        setUpdated(prev => {
          const current = new Map(prev)
          current.set(card.id, (current.get(card.id) || 0) + 1)
          if (current.get(card.id) === 0) current.delete(card.id)
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
        if (current.get(id) === 0) current.delete(id)
        return current
      })
    },
    [deckServer, added]
  )

  // --------------------------------------------------------------
  //                          Champions
  // --------------------------------------------------------------
  const [champions, setChampions] = useState<DeckRecord["champions"]>([])

  useEffect(() => {
    setChampions(deckServer?.champions || [])
  }, [deckServer?.champions])

  const addChampion = useCallback((card: Card) => {
    setChampions(prev => {
      if (!card?.image_uris) return prev

      const champion: DeckRecord["champions"][number] = {
        id: card.id,
        image_uri: card.image_uris["art_crop"],
      }

      if (!prev || !prev.length) return [champion]

      return [prev[prev.length - 1], champion]
    })
  }, [])

  const removeChampion = useCallback((id: Card["id"]) => {
    setChampions(prev => {
      if (!prev) return prev
      return prev.filter(x => x.id !== id)
    })
  }, [])

  // --------------------------------------------------------------

  const cards = useMemo(() => {
    if (!deckServer || !deckServer?.cards) return []

    const cards = deckServer?.cards.map(x => {
      const count = x.count + (updated.get(x.card.id) || 0)
      if (count <= 0) return null

      return { card: x.card, count }
    })

    added.forEach(item => cards.push(item))

    return cards?.filter(Boolean) as CardEntry[]
  }, [deckServer, added, updated])

  useEffect(() => {
    setChampions(prev =>
      prev.filter(champion => cards.findIndex(x => x.card.id === champion.id) !== -1)
    )
  }, [cards])

  const has = useCallback((id: string) => !!cards.find(x => x.card.id === id), [cards])

  const hasChanged = useMemo(() => {
    return (
      Boolean(added.size || updated.size) ||
      name !== deckServer?.name ||
      hashChampions(champions) !== hashChampions(deckServer.champions)
    )
  }, [added, updated, name, deckServer, champions])

  const deck = useMemo(() => {
    if (!deckServer) return null

    const cardsCount = cards.reduce((acc, x) => acc + x.count, 0)

    const deck: DeckLocal = {
      ...(deckServer || {}),
      name: name,

      cardsCount,
      cards,
      addCard,
      removeCard,

      champions,
      addChampion,
      removeChampion,

      has,
      hasChanged,
    }

    return deck
  }, [
    deckServer,
    name,

    cards,
    addCard,
    removeCard,

    champions,
    addChampion,
    removeChampion,

    has,
    hasChanged,
  ])

  const { isFetching: isSaving, saveDeck } = useDeckMutation({ deck, dropChanges })
  return (
    <DeckContext.Provider
      value={{ deck, setDeckId, saveDeck, setName, dropChanges, error, isFetching, isSaving }}
    >
      {children}
    </DeckContext.Provider>
  )
}

export function useDeck() {
  return useContext(DeckContext)
}
