import { NextResponse } from "next/server"
import { readDecks, type DeckRecord } from "../decks-json"

export async function POST(request: Request) {
  console.log("🚀 /deck/new")

  const decks = readDecks()

  let maxId = 0
  decks.forEach(d => {
    maxId = Math.max(parseInt(d.id), maxId)
  })
  maxId++

  const newDeck: DeckRecord = {
    id: maxId.toString(),
    name: "New deck #" + maxId,
    cards: [],
    champions: [],
  }
  console.log("🚀 | before fetch")

  const response = await fetch("http://localhost:3000/api/deck/add", {
    method: "POST",
    body: JSON.stringify(newDeck),
  })
  console.log("🚀 | GET | response:", response)

  if (response.ok) {
    const json = await response.json()
    return NextResponse.json(json)
  }

  return NextResponse.error()
}
