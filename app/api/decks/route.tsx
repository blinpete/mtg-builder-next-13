import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { prisma } from "@/lib/prismadb"
import { NextErrorResponse } from "@/types/errors"
import { deckUtils } from "./decks-converters"
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

  const decks = decksFromDB.map(deck => deckUtils.deserialize(deck))

  return NextResponse.json(decks, { status: 200 })
}

export async function UPDATE(request: UpdateDeckRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  const data = await request.json()

  const deck = await prisma.deck.update({
    where: {
      name_userId: {
        name: "" + data.name,
        userId: "" + decoded?.sub,
      },
    },
    data,
  })

  return NextResponse.json(deck, { status: 200 })
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
