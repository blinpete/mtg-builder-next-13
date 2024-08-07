import type { Card } from "@shared/types"

import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

export type CreateDeckData = {
  name: string
}

export type CreateDeckRequest = Omit<NextRequest, "json"> & {
  json: () => Promise<CreateDeckData>
}

export type UpdateDeckRequest = Omit<NextRequest, "json"> & {
  json: () => Promise<DeckRecord>
}

// export type DbDeck = Required<Prisma.DeckUpdateInput>
export type DbDeck = Required<Prisma.DeckUncheckedCreateInput>

export type DeckRecord = Omit<DbDeck, "cards" | "champions" | "sideboard"> & {
  cards: CardRecord[]
  sideboard: CardRecord[]
  champions: { id: string; image_uri: string }[]
}

export type CardRecord = [id: string, count: number]

export type CardEntry = {
  card: Card
  count: number
}

export type DeckRecordLoaded = Omit<DeckRecord, "cards" | "sideboard"> & {
  cards: CardEntry[]
  sideboard: CardEntry[]
}

type DiffKeys<A, B> = {
  [K in keyof (A | B)]: B[K] extends A[K] ? never : K
}[keyof (A | B)]

type DiffProps<A, B> = {
  [K in DiffKeys<A, B>]: B[K]
}

export type DeckLoadedToRecord = DiffProps<DeckRecordLoaded, DeckRecord>
export type DeckRecordToLoaded = DiffProps<DeckRecord, DeckRecordLoaded>

export type DeckLocal = DeckRecordLoaded & {
  cardsCount: number
  // hasChanged: boolean
  has: (id: string) => boolean

  addCard: (card: Card) => void
  removeCard: (id: Card["id"]) => void

  addChampion: (card: Card) => void
  removeChampion: (id: Card["id"]) => void
}

// export const Deck = Prisma.validator<Prisma.DeckArgs>()({
//   select: {
//     name: true,
//     cards: true,
//     sideboard: true,
//     createdAt: true,
//   },
// })
