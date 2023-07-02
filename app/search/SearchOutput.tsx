"use client"

import { useMemo, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { CardsGrid } from "./CardsGrid"
import { useDeck } from "./DeckContext"
import { Pagination } from "./Pagination"
import { ScrySearch, type Scry, type ScrySearchResponse, type ScrySearchError } from "./ScryfallAPI"

/**
 * https://scryfall.com/docs/api
 */
export function SearchOutput(props: {
  query: string
  options?: Scry.SearchOptions
  counters?: Record<string, number>
  cardHeaderFn?: Parameters<typeof CardsGrid>[0]["cardHeaderFn"]
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

  const { deck } = useDeck()

  const { data, error, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery<
    ScrySearchResponse,
    ScrySearchError
  >({
    queryKey: ["cards-search", props.query],

    queryFn: async ({ pageParam = 1 }) =>
      ScrySearch(props.query, {
        ...(props.options || {}),
        page: pageParam,
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.has_more) return pages.length + 1
    },

    retryOnMount: false,
    refetchOnWindowFocus: false,
    // keepPreviousData: true,
    // refetchInterval: -1,
  })
  console.log("🚀 | data:", data)
  console.log("🚀 | error:", error)

  const [page, setPage] = useState(1)
  const pageData = useMemo(() => data?.pages[page - 1]?.data, [data?.pages, page])
  const total = useMemo(() => data?.pages[0].total_cards || NaN, [data])
  const prevCount = useMemo(() => 175 * (page - 1), [page])
  const hasNext = useMemo(() => page * 175 < total, [page, total])
  const hasPrev = useMemo(() => page > 1, [page])

  console.log("🚀 | total:", total)
  console.log("🚀 | prevCount:", prevCount)
  console.log("🚀 | hasNext:", hasNext)
  console.log("🚀 | hasPrev:", hasPrev)

  if (data?.pages.length === page && hasNextPage) fetchNextPage()

  return (
    <section>
      {pageData && (
        <>
          <p className="text-center text-zinc-600 text-sm">
            {prevCount + 1} - {prevCount + pageData.length} of {total} cards
          </p>

          <Pagination setPage={setPage} hasPrev={hasPrev} hasNext={hasNext} />

          <CardsGrid
            data={pageData}
            counters={props.counters}
            onCardClick={card => deck?.addCard(card)}
            cardHeaderFn={props.cardHeaderFn}
          />
        </>
      )}

      {isFetching ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="mx-6 my-6">
          <strong>Error {error.status}:</strong> {error.details}
        </div>
      ) : (
        !data?.pages && <div>No cards found</div>
      )}
    </section>
  )
}
