"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "react-query"
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

  return (
    <section>
      {error && <div>Error: {JSON.stringify(error)}</div>}

      {decks && (
        <ul className="flex">
          {decks.map(d => (
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
      )}
    </section>
  )
}
