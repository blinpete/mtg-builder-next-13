import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { deckRecordToLoaded, deckUtilsServer } from "@/lib/deckUtils.server"
import { prisma } from "@/lib/prismadb"
import { NextErrorResponse } from "@/types/errors"
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

  const deck = deckUtilsServer.deserialize(deckFromDB)
  // console.log("🚀 | GET | deck:", deck)

  if (decoded?.sub !== deck?.userId) {
    return NextResponse.json("Not your deck", { status: 403 })
  }

  const response = await deckRecordToLoaded(deck)
  console.log("🚀 /decks/id | GET | response:", response)

  if (response.object === "error") {
    return NextErrorResponse.json("[error] loading cards by ids: " + response.code, {
      status: response.status,
      statusText: response.details,
    })
  }

  const loadedFields = response.data

  const deckWithCards: DeckRecordLoaded = {
    ...deck,
    ...loadedFields,
  }

  // return NextResponse.json({ data: deckWithCards })
  return NextResponse.json(deckWithCards, { status: 200 })
}
