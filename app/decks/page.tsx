"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { useQuery } from "react-query"
import { useDeck } from "../search/DeckContext"
import { DeckCover } from "./DeckCover"
import { useDecksMutation } from "./useDecksMutation"
import type { DeckRecord } from "@/types/decks"

export default function DeckPage() {
  const {
    data: decks,
    isFetching,
    error,
  } = useQuery<DeckRecord[], any>({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await fetch("/api/decks", {
        method: "GET",
        cache: "no-cache",
      })
      const res = await response.json()
      console.log("🚀 GET decks | queryFn: | res:", res)

      return res
    },
  })
  // or Prisma.DeckUncheckedCreateWithoutUserInput[]

  const pathname = usePathname()

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | decks:", decks)

  const router = useRouter()
  const { setDeckId } = useDeck()

  const { addDeck, isFetching: isMutationRunning } = useDecksMutation()

  async function handleAddDeck() {
    const deck = await addDeck()

    if (deck instanceof Error) {
      console.error("🚀 | handleAddDeck | error:", deck)
      return toast.error(deck.message)
    }

    setDeckId(deck.id)
    router.push("/decks/edit")
  }

  const { status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  if (isFetching) return <div className="m-4">Loading...</div>
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <section>
      <ul
        className="flex flex-wrap justify-evenly my-4 mx-3 [--li-pad:0.25rem]"
        style={{
          maxWidth: "42rem",
          marginRight: "8vw",
          marginLeft: "8vw",
        }}
      >
        <li key="decks_new" className="cursor-pointer hover:opacity-70">
          <button
            disabled={isMutationRunning}
            onClick={handleAddDeck}
            className="flex items-center p-[--li-pad] disabled:opacity-70"
          >
            <div
              className="flex items-center justify-center
                w-24 h-32
                border-2 border-gray-400 border-dashed rounded-md
                bg-gray-400/30 text-gray-600/70
                text-sm
              "
            >
              {isMutationRunning ? "Creating..." : "New deck"}
            </div>
          </button>
        </li>
        {decks &&
          decks.map(d => (
            <li key={"decks_" + d.id} className="cursor-pointer hover:opacity-90">
              <Link
                href={pathname + "/" + d.id}
                className="flex flex-col items-center p-[--li-pad] w-min"
              >
                <DeckCover deck={d} />

                {/* @ts-expect-error: textWrap is a new CSS prop */}
                <span className="text-xs my-1 text-center" style={{ textWrap: "balance" }}>
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
