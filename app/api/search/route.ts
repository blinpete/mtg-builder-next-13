import { NextResponse } from "next/server"
import * as Scry from "scryfall-sdk"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log("🚀 search | GET | searchParams:", searchParams)

  // const id = searchParams.get("id")
  const query = searchParams.get("q")
  if (!query) return NextResponse.json({ data: null, error: "empty query" })

  const data = await Scry.Cards.search(query, {
    dir: "auto",
    include_multilingual: false,
    include_variations: false,
    order: "set",
    unique: "art",
  })
    .cancelAfterPage()
    .waitForAll()

  return NextResponse.json({ data })
}

// export type SearchResponse = {
//   data: Scry.Card[] | null
//   error?: string
// }
