import { NextResponse } from "next/server"
import { readDecks } from "../decks-json"

export async function GET(request: Request) {
  const decks = readDecks()

  return NextResponse.json({ data: decks })
}

// export type SearchResponse = {
//   data: Scry.Card[] | null
//   error?: string
// }
