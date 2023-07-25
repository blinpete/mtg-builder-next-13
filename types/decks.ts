import type { Scry } from "@/app/search/ScryfallAPI"
import type { Prisma } from "@prisma/client"

export type CreateDeckData = {
  name: string
}

export type CreateDeckRequest = Omit<Request, "json"> & {
  json: () => Promise<CreateDeckData>
}

export type UpdateDeckRequest = Omit<Request, "json"> & {
  json: () => Promise<Prisma.DeckUpdateInput>
}

// export type DbDeck = Required<Prisma.DeckUpdateInput>
export type DbDeck = Required<Prisma.DeckUncheckedCreateInput>

export type DeckRecord = Omit<DbDeck, "cards" | "champions"> & {
  cards: [id: string, count: number][]
  champions: { id: string; image_uri: string }[]
}

export type CardEntry = {
  card: Scry.Card
  count: number
}

export type DeckRecordLoaded = Omit<DeckRecord, "cards"> & {
  cards: CardEntry[]
}

export type DeckLocal = DeckRecordLoaded & {
  hasChanged: boolean
  has: (id: string) => boolean
  addCard: (card: Scry.Card) => void
  removeCard: (id: Scry.Card["id"]) => void
}

// export const Deck = Prisma.validator<Prisma.DeckArgs>()({
//   select: {
//     name: true,
//     cards: true,
//     sideboard: true,
//     createdAt: true,
//   },
// })
