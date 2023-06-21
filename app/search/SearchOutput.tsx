"use client"

import Image from 'next/image'
import { Pagination } from './Pagination'
import { ScrySearch, type Scry } from './ScryfallAPI';
import { useInfiniteQuery } from 'react-query';

/**
 * https://scryfall.com/docs/api
 */
export function SearchOutput(props: {
  query: string
  options?: Scry.SearchOptions
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

  const curPage = parseInt(''+props.options?.page) || 1
  const prevPage = curPage - 1
  const curPageIdx = prevPage

  const { data, isFetching, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
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

  return (
    <section>
      {!isFetching && data?.pages && <>
          <p className="text-center text-zinc-600 text-sm">
            {prevPage*175 + 1} - {prevPage*175 + data.pages[curPageIdx].data.length} of {data.pages[0]?.total_cards} cards
          </p>
          
          <Pagination needNext={!!hasNextPage} />

          <ul
            className="
              mx-1 mt-4 list-none
              grid gap-x-1.5 gap-y-2.5
              grid-cols-2 
              md:grid-cols-4
              sm:grid-cols-3
            "
          >
            {data.pages[prevPage].data?.map(card => <li key={card.id}>
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
        : !data?.pages && <div>No cards found</div>}
    </section>
  )
}
