import { NextResponse } from "next/server"
import { readDecks, type DeckRecord, writeDecks } from "../decks-json"

export async function PATCH(request: Request) {
  console.log("🚀 save-by-id | request.body:", request.body)
  const reqJson = (await request.json()) as DeckRecord
  console.log("🚀 | PATCH | reqJson:", reqJson)

  const deckId = reqJson.id
  const decks = readDecks()

  if (decks.findIndex(x => x.id === reqJson.id) === -1) {
    return NextResponse.error()
  }

  const newDecks = decks.map(x => {
    if (x.id !== deckId) return x
    return reqJson
  })

  writeDecks(newDecks)

  return NextResponse.json({ data: "done" })
}
