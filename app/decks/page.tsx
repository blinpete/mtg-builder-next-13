"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { CreateDeckData } from "@/types/decks"
import type { ErrorJSON } from "@/types/errors"
import type { Prisma } from "@prisma/client"

export default function DecksLayout() {
  const { status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return (
    <>
      <Decks />
    </>
  )
}

const Decks = () => {
  const [decksNames, setDeckNames] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/decks", { method: "GET" })
      const decks: Prisma.DeckUncheckedCreateWithoutUserInput[] = await response.json()
      console.log(decks)
      setDeckNames(() => decks.map(deck => deck.name))
    }
    fetchData()
  }, [])

  async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault()
    const name: string = e.target[0].value
    if (!name) return

    const data: CreateDeckData = { name }
    const response = await fetch("/api/decks", { method: "POST", body: JSON.stringify(data) })
    const resJson: ErrorJSON | Prisma.DeckUncheckedCreateWithoutUserInput = await response.json()
    if ("error" in resJson) {
      toast.error(`Error: ${resJson.error}`)
    } else {
      setDeckNames(names => [...names, resJson.name])
    }
  }

  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input className="bg-white my-2 px-2" placeholder="deck name"></input>
        <button className="bg-white mb-4" type="submit">
          Create deck
        </button>
      </form>
      {decksNames.map(name => (
        <a className="hover:text-blue-600 transition" key={name} href={`/decks/${name}`}>
          {name}
        </a>
      ))}
    </>
  )
}
