"use client"

import { useMemo, useState } from "react"
import { useDeck } from "@/app/search/DeckContext"
import { SearchForm } from "@/app/search/SearchForm"
import { SearchOutput } from "@/app/search/SearchOutput"
import { DeckColumn } from "./DeckColumn"
import type { Card } from "scryfall-sdk"

export default function DeckPage() {
  const { deck } = useDeck()

  const [query, setQuery] = useState("")
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const counters = useMemo(() => {
    if (!deck) return
    return Object.fromEntries(deck?.cards.map(x => [x.card.id, x.count]))
  }, [deck])

  // if (isFetching) return <div>Loading...</div>
  if (!deck) return <div>Error: deck is null. This should never happen</div>
  if (!deck?.cards.length) return <div>Empty deck</div>

  return (
    <section
      className="
        border-0 border-red-500
        flex-auto flex flex-row w-full
      "
      style={{
        maxHeight: "calc(100vh - 3rem)",
      }}
    >
      {/* sidebar */}
      <article
        className="
        bg-gray-400/40 basis-64 flex-grow-0 flex-shrink-0
        overflow-y-auto
        "
      >
        <div>title: {deck?.name}</div>
        <div>deck: {deck?.cards.length} cards</div>
        <button
          className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
          onClick={() => {
            alert("implement saveDeck")
          }}
        >
          Save
        </button>

        <DeckColumn deck={deck} activeCard={activeCard} setActiveCard={setActiveCard} />
      </article>

      {/* Search -> Card Grid */}
      <article className="flex-auto flex items-center flex-col overflow-y-auto">
        <SearchForm
          query=""
          onSubmit={e => {
            e.preventDefault()
            const q = e.target?.search?.value as string
            if (!q) return

            setQuery(q.replaceAll(" ", "+"))
          }}
        />

        {query ? <SearchOutput query={query} counters={counters} /> : <div>Empty query</div>}
      </article>
    </section>
  )
}
