import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { prisma } from "@/lib/prismadb"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")

  const decoded = await decode({ token: token?.value, secret: "" + process.env.SECRET })

  const name = request.url.substring(request.url.lastIndexOf("/") + 1)
  console.log(`name: ${name}`)

  const deck = await prisma.deck.findUnique({
    where: {
      name_userId: {
        name,
        userId: "" + decoded?.sub,
      },
    },
  })

  return NextResponse.json(deck, { status: 200 })
}
