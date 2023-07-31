import type {
  CardEntry,
  CardRecord,
  DbDeck,
  DeckLoadedToRecord,
  DeckRecord,
  DeckRecordLoaded,
} from "@/types/decks"

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
