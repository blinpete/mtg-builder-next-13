import type { ScrySearchError, ScrySearchResponse } from "@shared/api"
import type {
  Card,
  CardEntry,
  CardRecord,
  DbDeck,
  DeckRecord,
  DeckRecordToLoaded,
} from "@shared/types"

export const deckUtilsServer = {
  // serialize(deck: Omit<DeckRecord, "id" | 'createdAt'>): Omit<DbDeck, "id" | "createdAt">
  serialize(deck: Omit<DeckRecord, "userId">): Omit<DbDeck, "userId"> {
    return {
      ...deck,
      cards: JSON.stringify(deck.cards),
      champions: JSON.stringify(deck.champions),
      sideboard: JSON.stringify(deck.sideboard),
    }
  },

  deserialize(deck: DbDeck): DeckRecord {
    return {
      // id: deck.id,
      // name: deck.name,
      ...deck,
      cards: JSON.parse(deck.cards),
      champions: JSON.parse(deck.champions),
      sideboard: JSON.parse(deck.sideboard || "[]"),
      // createdAt: JSON.parse(deck.createdAt),
      // user: deck.user
    }
  },
}

export async function deckRecordToLoaded(
  deck: DeckRecord
): Promise<{ object: "success"; data: DeckRecordToLoaded } | ScrySearchError> {
  const idsToLoad = new Set([
    ...deck.cards.map(x => ({ id: x[0] })),
    ...deck.sideboard.map(x => ({ id: x[0] })),
  ])

  if (idsToLoad.size === 0) {
    return {
      object: "success",
      data: {
        cards: [],
        sideboard: [],
      },
    }
  }

  const response = await fetch(`https://api.scryfall.com/cards/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    // don't pass an empty array to `identifiers` here
    body: JSON.stringify({ identifiers: [...idsToLoad] }),
  })
  const json = (await response.json()) as ScrySearchResponse | ScrySearchError

  if (json.object === "error") {
    return json
  }

  const map: Record<string, Card> = {}
  for (const card of json.data) {
    map[card.id] = card
  }

  function cardRecordToEntry([id, count]: CardRecord): CardEntry {
    return { card: map[id], count }
  }

  return {
    object: "success",
    data: {
      cards: deck.cards.map(cardRecordToEntry),
      sideboard: deck.sideboard.map(cardRecordToEntry),
    },
  }
}
