"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "react-query"
import { useDeck } from "../search/DeckContext"
import { DeckCover } from "./DeckCover"
import type { DeckRecord } from "../api/deck/decks-json"

export default function DeckPage() {
  const { data: decks, error } = useQuery<DeckRecord[], any>({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/deck/all", {
        method: "GET",
      })
      const res = await response.json()
      return res.data
    },
  })

  const pathname = usePathname()

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | decks:", decks)

  const queryClient = useQueryClient()
  const router = useRouter()
  const { setDeckId } = useDeck()

  async function addDeck() {
    const response = await fetch("http://localhost:3000/api/deck/new", {
      method: "POST",
      cache: "no-cache",
    })
    console.log("🚀 | addDeck | response:", response)

    if (response.ok) {
      const decks = (await response.json()) as DeckRecord[]
      console.log("🚀 | addDeck | decks:", decks)

      queryClient.setQueryData(["decks"], decks)

      setDeckId(decks[decks.length - 1].id)
      router.push("/decks/edit")
    }
  }

  return (
    <section>
      {error && <div>Error: {JSON.stringify(error)}</div>}

      <ul className="flex">
        <li key="decks_new" className="cursor-pointer hover:opacity-70">
          <div onClick={addDeck} className="flex items-center p-2">
            <div
              className="flex items-center justify-center
                w-24 h-32
                border-2 border-gray-400 border-dashed rounded-md
                bg-gray-400/30 text-gray-600/70
                text-sm
              "
            >
              New deck
            </div>
          </div>
        </li>
        {decks &&
          decks.map(d => (
            <li key={"decks_" + d.id} className="cursor-pointer hover:opacity-90">
              <Link href={pathname + "/" + d.id} className="flex flex-col items-center p-2">
                <DeckCover deck={d} />

                <span className="text-xs my-1">
                  {d.name}
                  {/* ({d.cards.length}) */}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
