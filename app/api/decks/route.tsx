import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { deckUtilsServer } from "@/lib/deckUtils.server"
import { prisma } from "@/lib/prismadb"
import { NextErrorResponse } from "@/types/errors"
import type { CreateDeckRequest, UpdateDeckRequest } from "@/types/decks"

export async function POST(request: CreateDeckRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  if (!decoded?.sub) {
    return new NextErrorResponse({ error: "Can't find user id in JWT" }, { status: 400 })
  }

  const data = await request.json()

  if (!data.name) {
    return new NextErrorResponse({ error: "Can't find 'name' in passed data" }, { status: 400 })
  }

  const exist = await prisma.deck.findUnique({
    where: {
      name_userId: {
        userId: decoded.sub,
        name: data.name,
      },
    },
  })

  if (exist) {
    return new NextErrorResponse({ error: "Deck with that name already exisis" }, { status: 209 })
  }

  try {
    const deck = await prisma.deck.create({
      data: {
        userId: decoded.sub,
        name: data.name,
      },
    })
    console.log(`deck: ${JSON.stringify(deck)}`)
    return NextResponse.json(deck, { status: 201 })
  } catch {
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
