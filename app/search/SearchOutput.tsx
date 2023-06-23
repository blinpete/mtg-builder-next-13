"use client"

import Image from 'next/image'
import { Pagination } from './Pagination'
import { ScrySearch, type Scry, type ScrySearchResponse, type ScrySearchError } from './ScryfallAPI';
import { useInfiniteQuery } from 'react-query';
import { useMemo, useState } from 'react';

/**
 * https://scryfall.com/docs/api
 */
export function SearchOutput(props: {
  query: string
  options?: Scry.SearchOptions
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

  const {
    data, error,
    isFetching,
    hasNextPage, fetchNextPage
  } = useInfiniteQuery<ScrySearchResponse, ScrySearchError>({
    queryKey: ['cards-search', props.query],
    
    queryFn: async ({ pageParam = 1 }) => ScrySearch(props.query, {
      ...(props.options || {}),
      page: pageParam
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
  const pageData = useMemo(() => data?.pages[page-1]?.data, [data?.pages, page])
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
      {data?.pages && data?.pages[page-1] && <>
          <p className="text-center text-zinc-600 text-sm">
            {prevCount + 1} - {prevCount + data.pages[page-1].data.length} of {data.pages[0]?.total_cards} cards
          </p>

          <Pagination setPage={setPage} hasPrev={hasPrev} hasNext={hasNext} />

          <ul
            className="
              mx-1 mt-4 list-none
              grid gap-x-1.5 gap-y-2.5
              grid-cols-2 
              md:grid-cols-4
              sm:grid-cols-3
            "
          >
            {data.pages[page-1].data?.map(card => <li key={card.id}>
              {card.image_uris && <Image
                className="magic-card h-auto"
                src={card.image_uris?.normal || card.image_uris.png}
                height={320}
                width={240}
                alt={card.name}
              />}
            </li>)}
          </ul>
        </>
      }
      
      { isFetching
        ? <div>Loading...</div>
        : error
        ? <div className="mx-6 my-6">
            <strong>Error {error.status}:</strong> {error.details}
          </div>
        : !data?.pages && <div>No cards found</div>}
    </section>
  )
}
