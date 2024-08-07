"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { LayoutMain } from "@widgets/LayoutMain"
import {
  SearchInput,
  SearchOutput,
  useStoreSearchQuery,
  DEFAULT_SEARCH_QUERY,
} from "@features/Search"
import { CardPreviewPortal, useStoreActiveCard } from "@entities/card"
import type { SearchOptions } from "@shared/api"

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
 * - year>2020 c:black order:set unique:art t:vampire
 *
 * #### formats
 * https://magic.wizards.com/en/formats
 */
export function SearchPage(props: {
  searchParams?: {
    q?: string
  } & SearchOptions
}) {
  const activeCard = useStoreActiveCard(s => s.card)
  const setActiveCard = useStoreActiveCard(s => s.setCard)
  useEffect(() => setActiveCard(null), [setActiveCard])

  const query = useStoreSearchQuery(s => s.query)
  console.log("🚀🚀🚀 | query:", query)

  const setQuery = useStoreSearchQuery(s => s.setQuery)
  if (props.searchParams?.q) {
    setQuery(props.searchParams?.q)
  }

  const pathname = usePathname()
  const router = useRouter()

  if (!props.searchParams?.q) {
    const q = (query || DEFAULT_SEARCH_QUERY).replaceAll(" ", "+")

    router.replace(`${pathname}?q=${q}`)
  }

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
        <div className="flex-grow pt-1 text-zinc-500">start searching cards...</div>
      )}
    </LayoutMain>
  )
}
