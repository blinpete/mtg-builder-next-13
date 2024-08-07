import type { CardEntry, CardRecord, DeckLoadedToRecord, DeckRecordLoaded } from "../types"

export const deckUtilsClient = {}

function cardEntryToRecord(x: CardEntry): CardRecord {
  return [x.card.id, x.count]
}

export function deckLoadedToRecord(deck: DeckRecordLoaded): DeckLoadedToRecord {
  return {
    cards: deck.cards.map(cardEntryToRecord),
    sideboard: deck.sideboard.map(cardEntryToRecord),
  }
}

export function sortCards(cards: CardEntry[]) {
  const sorted = [...cards]

  sorted.sort((a, b) => {
    // push lands to the end
    if (a.card.cmc === 0) return 1
    if (b.card.cmc === 0) return -1

    // sort by "Cumulative Mana Cost" in INC order
    return a.card.cmc - b.card.cmc
  })

  return sorted
}
