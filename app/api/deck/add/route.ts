import { NextResponse } from "next/server"
import { readDecks, type DeckRecord, writeDecks } from "../decks-json"

export async function POST(request: Request) {
  // const { searchParams } = new URL(request.url)
  // console.log("🚀 add-deck | searchParams:", searchParams)
  console.log("🚀 add-deck | request.body:", request.body)
  const reqJson = (await request.json()) as DeckRecord
  console.log("🚀 | POST | reqJson:", reqJson)

  const json = readDecks()

  if (json.findIndex(x => x.id === reqJson.id) !== -1) {
    return NextResponse.json({ data: "skip" })
  }

  json.push(reqJson)
  writeDecks(json)

  return NextResponse.json(json)
}
