"use client"

import { useState } from "react"
import { CardPreviewPortal } from "@entities/card"
import { SearchInput, SearchOutput } from "@features/Search"
import { LayoutMain } from "@widgets/LayoutMain"
import type { SearchOptions } from "@shared/api"
import type { Card } from "@shared/types"

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
export function SearchPage(props: {
  searchParams?: {
    q?: string
  } & SearchOptions
}) {
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  return (
    <LayoutMain>
      <SearchInput />

      {props.searchParams?.q ? (
        <>
          <SearchOutput
            query={props.searchParams.q}
            options={props.searchParams}
            onCardClick={card => setActiveCard(card)}
          />

          {/* https://react.dev/reference/react-dom/createPortal */}
          {activeCard && (
            <CardPreviewPortal card={activeCard} onClick={() => setActiveCard(null)} />
          )}
        </>
      ) : (
        <div>Empty query</div>
      )}
    </LayoutMain>
  )
}
