import type { Card, DeckRecordLoaded } from "@shared/types"

type Return = {
  champions: Card[]
  cardsExceptChampions: Card[]
}

export function useChampions(deck?: DeckRecordLoaded): Return {
  if (!deck) {
    return {
      champions: [],
      cardsExceptChampions: [],
    }
  } else {
    const filtered = deck?.cards
      ?.filter(x => deck.champions.findIndex(champion => champion.id === x.card.id) === -1)
      .map(x => x.card)
    // const sorted = sortCards(filtered)
    // return sorted.map(x => x.card)

    const champions = deck.champions
      .map(ch => deck.cards.find(x => x.card.id === ch.id)?.card)
      .filter(Boolean) as Card[]

    return {
      champions,
      cardsExceptChampions: filtered,
    }
  }
}
