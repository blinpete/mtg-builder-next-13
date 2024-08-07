"use client"

import { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery } from "react-query"

import { CardsGrid, type CardsGridProps } from "@entities/card-collection"
import {
  ScrySearch,
  type ScrySearchResponse,
  type ScrySearchError,
  type SearchOptions,
} from "@shared/api"
import { Pagination } from "@shared/ui"

const wrap = (children: JSX.Element) => <div className="mx-6 my-6">{children}</div>

/**
 * https://scryfall.com/docs/api
 */
export function SearchOutput(
  props: CardsGridProps & {
    query: string
    options?: SearchOptions
    cardHeaderFn?: Parameters<typeof CardsGrid>[0]["cardHeaderFn"]
  }
) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

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

  useEffect(() => {
    setPage(1)
  }, [props.query])

  console.log("🚀 | page:", page)
  console.log("🚀 | total:", total)
  console.log("🚀 | prevCount:", prevCount)
  console.log("🚀 | hasNext:", hasNext)
  console.log("🚀 | hasPrev:", hasPrev)

  if (data?.pages.length === page && hasNextPage) fetchNextPage()

  if (isFetching) return <div>Loading...</div>

  if (error) {
    return wrap(
      <>
        <strong>Error {error.status}:</strong> {error.details}
      </>
    )
  }

  if (!data?.pages) return wrap(<div>No cards found</div>)

  return (
    <section className="w-full">
      {pageData && (
        <>
          <p className="text-center text-zinc-600 text-sm">
            {prevCount + 1} - {prevCount + pageData.length} of {total} cards
          </p>

          <Pagination setPage={setPage} hasPrev={hasPrev} hasNext={hasNext} />

          <CardsGrid
            data={pageData}
            counters={props.counters}
            onCardClick={props.onCardClick}
            cardHeaderFn={props.cardHeaderFn}
          />
        </>
      )}
    </section>
  )
}
