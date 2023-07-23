"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import type { Prisma } from "@prisma/client"
// import { useEffect, useState } from "react"

export default function DeckLayout({ params }: { params: { name: string } }) {
  const { status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>You are not logged in</p>
  }

  return (
    <>
      <Deck name={params.name} />
    </>
  )
}

interface DeckProps {
  name: string
}

const Deck = ({ name }: DeckProps) => {
  const [deck, setDeck] = useState<Prisma.DeckCreateInput>()

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(`/api/decks/${name}`)
      const d: Prisma.DeckCreateInput = await resp.json()
      setDeck(() => d)
    }

    fetchData()
  }, [name])
  return (
    <>
      <p>path: {name}</p>
      <p>Deck name: {deck?.name}</p>
      <p>Cards: {deck?.cards}</p>
      <p>Sideboard: {deck?.sideboard}</p>
      <p>Created at: {JSON.stringify(deck?.createdAt)}</p>
    </>
  )
}
