import { NextResponse } from "next/server"

import { prisma } from "@shared/lib/prismadb"
import { NextErrorResponse, type UpdateDeckRequest } from "@shared/types"

import { deckUtilsServer } from "./deckUtils.server"
import { getDecodedJWT } from "./utilsJWT"

import type { NextRequest } from "next/server"

/**
 * Creates a new deck
 */
export async function POST(request: NextRequest) {
  const decoded = await getDecodedJWT(request)

  if (!decoded?.sub) {
    return new NextErrorResponse({ error: "Can't find user id in JWT" }, { status: 400 })
  }

  // TODO: fix typecheck: create deck like this, then serialize and pass to prisma.deck.create()
  // const newDeck: Omit<DeckRecord, "id"|"createdAt"> = {
  //   userId: decoded.sub,
  //   name: "msal'kmsdf",
  //   cards: [],
  //   champions: [],
  //   sideboard: [],
  // }

  // const newDeckSerialized = deckUtilsServer.serialize(newDeck)

  try {
    const deck = await prisma.deck.create({
      data: {
        userId: decoded.sub,
        name: "New deck",
        cards: "[]",
        sideboard: "[]",
        champions: "[]",
      },
    })
    console.log(`deck: ${JSON.stringify(deck)}`)

    const deckDeserialized = deckUtilsServer.deserialize(deck)

    return NextResponse.json(deckDeserialized, { status: 201 })
  } catch (err) {
    console.log("🚀 decks | POST | err:", err)

    return new NextErrorResponse({ error: "Unknown error on deck creation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const decoded = await getDecodedJWT(request)

  if (!decoded?.sub) {
    return NextErrorResponse.json("Not logged in", { status: 403 })
  }

  const decksFromDB = await prisma.deck.findMany({
    where: {
      userId: decoded?.sub,
    },
  })

  const decks = decksFromDB.map(deck => deckUtilsServer.deserialize(deck))

  return NextResponse.json(decks, { status: 200 })
}

export async function PATCH(request: UpdateDeckRequest) {
  const decoded = await getDecodedJWT(request)

  const deck = await request.json()

  const deckSerialized = deckUtilsServer.serialize(deck)

  console.log("🚀 Decks | PATCH | decoded:", decoded)
  console.log("🚀 Decks | PATCH | deck:", deck.id)

  // if (!deck.id) {
  //   return new NextErrorResponse({ error: "deck.id is required" }, { status: 400 })
  // }

  const updatedDeck = await prisma.deck.update({
    where: { id: deck.id },
    data: deckSerialized,
  })

  return NextResponse.json(updatedDeck, { status: 200 })
}
