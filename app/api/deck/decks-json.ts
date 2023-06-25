import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import type { Scry } from "@/app/search/ScryfallAPI"

const filename = resolve(process.cwd(), "app/api/deck/decks.json")

export type DeckRecord = {
  id: string
  name: string
  cards: [id: string, count: number][]
}

export type DeckRecordLoaded = Omit<DeckRecord, "cards"> & {
  cards: { card: Scry.Card; count: number }[]
}

export function readDecks() {
  const text = readFileSync(filename, { encoding: "utf-8" })
  const json = JSON.parse(text) as DeckRecord[]
  return json
}

export function writeDecks(data: DeckRecord[]) {
  writeFileSync(filename, JSON.stringify(data, null, 2))
}
