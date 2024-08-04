import { create } from "zustand"
import type { CardEntry, DeckRecord } from "@shared/types"
import type { Card } from "scryfall-sdk"

type State = {
  name: string
  cards: Map<string, CardEntry>
  champions: DeckRecord["champions"]
}

type Actions = {
  setName: (name: string) => void

  setCards: (cards: CardEntry[]) => void
  addCard: (card: Card) => void
  removeCard: (id: Card["id"]) => void
  has: (id: Card["id"]) => boolean

  setChampions: (champions: DeckRecord["champions"]) => void
  addChampion: (card: Card) => void
  removeChampion: (id: Card["id"]) => void

  setState: (state: State) => void
}

type DeckStore = State & Actions

export const useStoreActiveDeck = create<DeckStore>()((set, get, api) => ({
  name: "",
  setName: name => set({ name }),

  // --------------------------------------------------------
  //                          cards
  // --------------------------------------------------------
  cards: new Map(),
  setCards: cards => {
    const cardsMap = new Map()
    cards.forEach(c => cardsMap.set(c.card.id, c))
    set({ cards: cardsMap })
  },
  addCard: card => {
    const cards = new Map(get().cards)

    const c = cards.get(card.id)
    if (c) {
      cards.set(card.id, { card, count: c.count + 1 })
    } else {
      cards.set(card.id, { card, count: 1 })
    }

    set({ cards })
  },
  removeCard: id => {
    const cards = new Map(get().cards)

    const c = cards.get(id)
    if (c) {
      c.count -= 1
      if (c.count <= 0) {
        // remove completely
        cards.delete(id)

        // remove from champions if that was one
        get().removeChampion(id)
      }
    }

    set({ cards })
  },
  has: id => {
    return get().cards?.has(id)
  },

  // --------------------------------------------------------
  //                         champions
  // --------------------------------------------------------
  champions: [],
  setChampions: champions => set({ champions }),
  addChampion: card => {
    if (!card?.image_uris) return

    const champions = get().champions

    const champion: DeckRecord["champions"][number] = {
      id: card.id,
      image_uri: card.image_uris["art_crop"],
    }

    if (!champions || !champions.length) {
      set({ champions: [champion] })
      return
    }

    set({ champions: [champions[champions.length - 1], champion] })
  },
  removeChampion: id => {
    const champions = get().champions
    if (!champions) return

    set({ champions: champions.filter(x => x.id !== id) })
  },

  // --------------------------------------------------------
  //                         common
  // --------------------------------------------------------
  setState: state => set(state),
}))

export function useStoreActiveDeckCardsCount() {
  // use useShallow use use
  return useStoreActiveDeck(state => {
    let count = 0
    state.cards.forEach(card => {
      count += card.count
    })
    return count
  })
}