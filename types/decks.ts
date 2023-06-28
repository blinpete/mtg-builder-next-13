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

// export const Deck = Prisma.validator<Prisma.DeckArgs>()({
//   select: {
//     name: true,
//     cards: true,
//     sideboard: true,
//     createdAt: true,
//   },
// })
