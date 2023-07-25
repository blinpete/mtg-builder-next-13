import type { DeckRecord } from "../deck/decks-json"
import type { Prisma } from "@prisma/client"

export const deckUtils = {
  serialize(deck: DeckRecord): Prisma.DeckUpdateInput {
    return {
      // id: deck.id,
      // name: deck.name,
      ...deck,
      cards: JSON.stringify(deck.cards),
      champions: JSON.stringify(deck.champions),
      sideboard: JSON.stringify(deck.sideboard),
      createdAt: JSON.stringify(deck.createdAt),
      // user: deck.user
    }
  },

  deserialize(deck: Prisma.DeckUpdateInput): DeckRecord {
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
