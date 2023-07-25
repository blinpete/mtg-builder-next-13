"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { useQuery, useQueryClient } from "react-query"
import { useDeck } from "../search/DeckContext"
import { DeckCover } from "./DeckCover"
import type { DeckRecord } from "../api/deck/decks-json"
import type { CreateDeckData } from "@/types/decks"
import type { ErrorJSON } from "@/types/errors"
import type { Prisma } from "@prisma/client"

export default function DeckPage() {
  const {
    data: decks,
    isFetching,
    error,
  } = useQuery<Prisma.DeckUpdateInput[], any>({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await fetch("/api/decks", {
        method: "GET",
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
      const decks = (await response.json()) as DeckRecord[] | ErrorJSON
      if ("error" in decks) {
        return toast.error(`Error: ${decks.error}`)
      }

      console.log("🚀 | addDeck | decks:", decks)

      queryClient.setQueryData(["decks"], decks)

      setDeckId(decks[decks.length - 1].id)
      router.push("/decks/edit")
    } else {
      return toast.error(`Unknown error: ${response.body}`)
    }
  }

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch("/api/decks", { method: "GET" })
  //     const decks: Prisma.DeckUncheckedCreateWithoutUserInput[] = await response.json()
  //     console.log(decks)
  //     setDeckNames(() => decks.map(deck => deck.name))
  //   }
  //   fetchData()
  // }, [])

  // async function handleSubmit(e: any) {
  //   // Prevent the browser from reloading the page
  //   e.preventDefault()
  //   const name: string = e.target[0].value
  //   if (!name) return

  //   const data: CreateDeckData = { name }
  //   const response = await fetch("/api/decks", { method: "POST", body: JSON.stringify(data) })
  //   const resJson: ErrorJSON | Prisma.DeckUncheckedCreateWithoutUserInput = await response.json()
  //   if ("error" in resJson) {
  //     toast.error(`Error: ${resJson.error}`)
  //   } else {
  //     setDeckNames(names => [...names, resJson.name])
  //   }
  // }

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
