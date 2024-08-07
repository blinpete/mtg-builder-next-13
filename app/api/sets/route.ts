import { NextResponse } from "next/server"
import * as Scry from "scryfall-sdk"

export async function GET() {
  // const data = await Scry.setFuzzySearch()
  const data = await Scry.Sets.all()
  data.length = 20

  return NextResponse.json({ data })
}
