"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { LayoutMain } from "@widgets/LayoutMain"
import { AuthGuard } from "@features/AuthGuard"
import { DeckCover, useDeck, useDecksMutation, useDecksQuery } from "@entities/deck"

export function DecksPage() {
  return (
    <LayoutMain>
      <AuthGuard>
        <Page />
      </AuthGuard>
    </LayoutMain>
  )
}

function Page() {
  const { data: decks, isFetching, error } = useDecksQuery()
  const { addDeck, isFetching: isMutationRunning } = useDecksMutation()
  const { setDeckId } = useDeck()

  console.log("🚀 | DeckPage | error:", error)
  console.log("🚀 | decks:", decks)

  const pathname = usePathname()
  const router = useRouter()

  async function handleAddDeck() {
    const deck = await addDeck()

    if (deck instanceof Error) {
      console.error("🚀 | handleAddDeck | error:", deck)
      return toast.error(deck.message)
    }

    setDeckId(deck.id)
    router.push("/decks/edit")
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
