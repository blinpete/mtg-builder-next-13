"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useDeck } from "@/app/search/DeckContext"
import { ScryRulings } from "@/app/search/ScryfallAPI"
import { SearchForm } from "@/app/search/SearchForm"
import { SearchOutput } from "@/app/search/SearchOutput"
import { cn } from "@/lib/utils"
import { CardDotCounter } from "./CardDotCounter"
import { DeckColumn } from "./DeckColumn"
import type { Card, Ruling } from "scryfall-sdk"

export default function DeckPage() {
  const { deck } = useDeck()

  const [query, setQuery] = useState("")
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [rulings, setRulings] = useState<Ruling[]>([])
  useEffect(() => {
    if (!activeCard) return

    const ac = new AbortController()
    ScryRulings(activeCard.rulings_uri, ac.signal).then(response => {
      setRulings(response.data)
    })

    return () => ac.abort()

    // let ignore = false

    // async function load() {
    //   if (!activeCard) return
    //   const data = await activeCard.getRulings()
    //   console.log("🚀 | load | activeCard.getRulings:", activeCard.getRulings)

    //   if (!ignore) {
    //     setRulings(data)
    //   }
    // }

    // load()

    // return () => {
    //   ignore = true
    // }
  }, [activeCard])

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
        <div>deck: {deck?.cards.reduce((acc, x) => acc + x.count, 0)} cards</div>
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
      <article
        className="flex-auto flex items-center flex-col overflow-y-auto"
        style={{
          fontSize: "0.92em",
        }}
      >
        <SearchForm
          query=""
          onSubmit={e => {
            e.preventDefault()
            const q = e.target?.search?.value as string
            if (!q) return

            setQuery(q.replaceAll(" ", "+"))
          }}
        />

        {query ? (
          <SearchOutput
            query={query}
            counters={counters}
            cardHeaderFn={(card, counters, visible) => (
              <CardDotCounter
                card={card}
                counters={counters}
                addCard={deck.addCard}
                removeCard={deck.removeCard}
                visible={visible}
              />
            )}
          />
        ) : (
          <div>Empty query</div>
        )}

        {/* overlay */}
        {activeCard && (
          <div
            className="
              bg-gray-600/95 backdrop-blur-0 text-gray-200
              flex flex-row gap-5 px-3
              fixed top-12 bottom-0 left-64 right-0
              cursor-pointer
            "
            onClick={() => setActiveCard(null)}
          >
            <div className="flex flex-col justify-center flex-shrink-0">
              {activeCard.image_uris && (
                <Image
                  className={cn("magic-card h-auto w-max")}
                  src={activeCard.image_uris?.normal || activeCard.image_uris.png}
                  height={320}
                  width={240}
                  alt={activeCard.name}
                />
              )}

              {/* <div>{activeCard.flavor_text}</div> */}
              <div>rarity: {activeCard.rarity}</div>
              <div>
                keywords:{" "}
                {activeCard.keywords.map(k => (
                  <span key={activeCard.id + k}>{k}</span>
                ))}
              </div>
            </div>
            <div className="overflow-scroll my-auto" style={{ maxHeight: "calc(100vh - 3rem)" }}>
              <div className="flex flex-col justify-center gap-2 py-10">
                <h2 className="font-bold mb-3">Rulings:</h2>
                {rulings.map((r, i) => (
                  <div key={activeCard.id + "rule_" + i}>
                    <p>{r.comment}</p>
                    <p>({r.published_at})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  )
}
