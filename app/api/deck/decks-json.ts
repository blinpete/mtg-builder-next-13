import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import type { Scry } from "@/app/search/ScryfallAPI"

const filename = resolve(process.cwd(), "app/api/deck/decks.json")

export type DeckRecord = {
  id: string
  name: string
  cards: string[]
}

export type DeckRecordLoaded = Omit<DeckRecord, "cards"> & {
  cards: Scry.Card[]
}

export function readDecks() {
  const text = readFileSync(filename, { encoding: "utf-8" })
  const json = JSON.parse(text) as DeckRecord[]
  return json
}

export function writeDecks(data: DeckRecord[]) {
  writeFileSync(filename, JSON.stringify(data, null, 2))
}