import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { prisma } from "@/lib/prismadb"
import { deckUtils } from "../decks-converters"
import type { Scry, ScrySearchError, ScrySearchResponse } from "@/app/search/ScryfallAPI"
import type { DeckRecordLoaded } from "@/types/decks"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  const id = request.url.substring(request.url.lastIndexOf("/") + 1)
  console.log(`name: ${id}`)

  const deckFromDB = await prisma.deck.findUnique({
    where: {
      id: id,
      // name_userId: {
      //   name,
      //   userId: "" + decoded?.sub,
      // },
    },
  })
  console.log("🚀 | GET | deckFromDB:", deckFromDB)

  if (!deckFromDB) {
    return NextResponse.json("Not found deck with id: " + id, { status: 404 })
  }

  const deck = deckUtils.deserialize(deckFromDB)
  console.log("🚀 | GET | deck:", deck)

  if (decoded?.sub !== deck?.userId) {
    return NextResponse.json("Not your deck", { status: 403 })
  }

  const response = await fetch(`https://api.scryfall.com/cards/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiers: deck.cards.map(x => ({ id: x[0] })) }),
  })
  const json = (await response.json()) as ScrySearchResponse | ScrySearchError

  if (json.object === "error") {
    return NextResponse.error()
  }

  const map: Record<string, Scry.Card> = {}
  for (const card of json.data) {
    map[card.id] = card
  }

  const deckWithCards: DeckRecordLoaded = {
    ...deck,
    cards: deck.cards.map(([id, count]) => ({ card: map[id], count })),
  }

  // return NextResponse.json({ data: deckWithCards })
  return NextResponse.json(deckWithCards, { status: 200 })
}
