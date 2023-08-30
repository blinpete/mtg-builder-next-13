"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { CardPreview } from "../decks/edit/CardPreview"
import { SearchInput } from "./SearchInput"
import { SearchOutput } from "./SearchOutput"
import type { Card, SearchOptions } from "scryfall-sdk"

/**
 * #### Scryfall routes
 * https://github.com/ChiriVulpes/scryfall-sdk/blob/main/ROUTES.md
 *
 * #### sets
 * - https://scryfall.com/sets
 * - https://scryfall.com/sets/eld
 * - https://scryfall.com/sets/mh1
 * - https://scryfall.com/sets/rna
 * - https://scryfall.com/sets/som
 * - https://scryfall.com/sets/m11
 *
 * #### advanced search examples
 * - https://scryfall.com/search?as=grid&order=name&q=type%3Acreature+set%3Amat
 * - https://gatherer.wizards.com/Pages/Default.aspx
 *
 * #### formats
 * https://magic.wizards.com/en/formats
 */
export default function Search(props: {
  searchParams?: {
    q?: string
  } & SearchOptions
}) {
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const portalNode = document.getElementById("portal-root")

  return (
    <>
      <SearchInput />

      {props.searchParams?.q ? (
        <>
          <SearchOutput
            query={props.searchParams.q}
            options={props.searchParams}
            onCardClick={card => setActiveCard(card)}
          />

          {/* https://react.dev/reference/react-dom/createPortal */}
          {activeCard &&
            portalNode &&
            createPortal(
              <CardPreview
                showChampionButtons={false}
                isInDeck={false}
                height="100dvh"
                card={activeCard}
                onClick={() => setActiveCard(null)}
              />,
              portalNode,
              "CardPreview"
            )}
        </>
      ) : (
        <div>Empty query</div>
      )}
    </>
  )
}
