import { NextResponse } from "next/server"
import { readDecks } from "../decks-json"
import type { DeckRecordLoaded } from "../decks-json"
import type { ScrySearchError, ScrySearchResponse } from "@/app/search/ScryfallAPI"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log("🚀 add-deck | searchParams:", searchParams)

  const deckId = searchParams.get("id")
  const decks = readDecks()
  const deck = decks.find(x => x.id === deckId)

  if (!deck) {
    return NextResponse.error()
  }

  const response = await fetch(`https://api.scryfall.com/cards/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiers: deck.cards.map(x => ({ id: x })) }),
  })
  const json = (await response.json()) as ScrySearchResponse | ScrySearchError

  if (json.object === "error") {
    return NextResponse.error()
  }

  const deckWithCards: DeckRecordLoaded = {
    ...deck,
    cards: json.data,
  }

  return NextResponse.json({ data: deckWithCards })
}
