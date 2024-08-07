import { NextResponse } from "next/server"

import { prisma } from "@shared/lib/prismadb"
import { NextErrorResponse, type DeckRecordLoaded } from "@shared/types"

import { deckRecordToLoaded, deckUtilsServer } from "../deckUtils.server"
import { getDecodedJWT } from "../utilsJWT"

import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const decoded = await getDecodedJWT(request)

  const id = request.url.substring(request.url.lastIndexOf("/") + 1)
  console.log(`deck id: ${id}`)

  const deckFromDB = await prisma.deck.findUnique({
    where: {
      id: id,
    },
  })
  // console.log("🚀 | GET | deckFromDB:", deckFromDB)

  if (!deckFromDB) {
    return NextErrorResponse.json("No deck found by id: " + id, { status: 404 })
  }

  const deck = deckUtilsServer.deserialize(deckFromDB)
  // console.log("🚀 | GET | deck deserialized:", deck)
  console.log("🚀 | GET | decoded:", decoded)

  if (decoded?.sub !== deck?.userId) {
    return NextErrorResponse.json("Not your deck", { status: 403 })
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

  return NextResponse.json(deckWithCards, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const decoded = await getDecodedJWT(request)

  const deckFromDB = await prisma.deck.findUnique({
    where: {
      id: params.id,
    },
    select: {
      userId: true,
    },
  })

  const alwaysReturnThis = new Response(null, { status: 204 })

  if (!deckFromDB || deckFromDB.userId !== decoded?.sub) {
    return alwaysReturnThis
  }

  await prisma.deck.delete({
    where: {
      id: params.id,
    },
  })

  return alwaysReturnThis
}
