import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { deckUtilsServer } from "@/lib/deckUtils.server"
import { prisma } from "@/lib/prismadb"
import { NextErrorResponse } from "@/types/errors"
import type { CreateDeckRequest, UpdateDeckRequest } from "@/types/decks"

/**
 * Creates a new deck
 */
export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

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

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  const decksFromDB = await prisma.deck.findMany({
    where: {
      userId: decoded?.sub,
    },
  })

  const decks = decksFromDB.map(deck => deckUtilsServer.deserialize(deck))

  return NextResponse.json(decks, { status: 200 })
}

export async function PATCH(request: UpdateDeckRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })
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

export async function DELETE(request: CreateDeckRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  const data = await request.json()

  await prisma.deck.delete({
    where: {
      name_userId: {
        name: data.name,
        userId: "" + decoded?.sub,
      },
    },
  })

  return NextResponse.json({ status: 204 })
}
