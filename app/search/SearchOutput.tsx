"use client"

import Image from 'next/image'
import type Scry from 'scryfall-sdk'
import { Pagination } from './Pagination'
import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { VirtualList } from './VirtualList';

const images: HTMLImageElement[] = [];
function preload(urls: (string | undefined)[]) {
  let url
  for (var i = 0; i < urls.length; i++) {
    url = urls[i] 
    if (!url) continue

    images[i] = new window.Image();
    images[i].src = url;
  }
}

type ScrySearchResponse = {
  object: "list"
  total_cards: number
  has_more: boolean
  next_page: string // url with ?page=NEXT_PAGE
  data: Scry.Card[]
}

/**
 * Docs:
 * https://scryfall.com/docs/api/lists
 * 
 * Example:
 * GET https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1
*/
async function ScrySearch(query: string, options?: Scry.SearchOptions) {
  const searchParams = Object
    .entries(options || {})
    .reduce((acc, [k,v]) => acc+`&${k}=${v}`, `q=${query}`)

  const response = await fetch(`https://api.scryfall.com/cards/search?${searchParams}`)
  const json = await response.json() as ScrySearchResponse

  return json
}

function range(start: number, length: number) {
  return Array.from({length}).map((_,i) => start + i)
}

/**
 * https://scryfall.com/docs/api
 */
export function SearchOutput(props: {
  query: string
  options?: Scry.SearchOptions
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)
  
  const [rowSize, setRowSize] = useState(4)
  useEffect(() => {
    // const total = 240*X + (X-1)*gap = (240+gap)*X - gap
    const gap = 6
    const vpWidth = window.visualViewport?.width

    if (vpWidth) {
      setRowSize(Math.floor((vpWidth + gap) / (240 + gap)))
    }
  }, [])
  // plus ResizeObserver

  const { data, isFetching, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['cards-search', props.query],
    
    queryFn: async ({ pageParam = 1 }) => ScrySearch(props.query, {
      ...(props.options || {}),
      page: pageParam
    }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.has_more) return pages.length + 1
    },

    // queryFn: async ({pageParam = 1}) => {
    //   await new Promise(resolve => setTimeout(resolve, 1000))

    //   return {
    //     has_more: true,
    //     data: Array.from({length: 15}).map((_,i) => {
    //       return {
    //         id: i + 15*(pageParam - 1),
    //         data: pageParam*i,
    //       }
    //     })
    //   }
    // },
    // getNextPageParam: (lastPage, pages) => {
    //   if (lastPage.has_more) return pages.length + 1
    // },

    retryOnMount: false,
    refetchOnWindowFocus: false,
    // keepPreviousData: true,
    // refetchInterval: -1,
  })
  console.log("🚀 | data:", data)
  console.log("🚀 | error:", error)

  const flatList = useMemo(() => data?.pages.map(p => p.data).flat(), [data?.pages])

  return (
    <section className="w-full">
      {data && <>
          <p className="text-center text-zinc-600 text-sm">
            {flatList?.length} loaded | {data.pages[0].total_cards} cards in total
          </p>
      
          {flatList && 
            <VirtualList
              itemsLength={Math.ceil(flatList.length / rowSize)}
              rowFn={({index, style}) => (
                <div style={style} className="flex justify-center gap-2 py-2">{
                  range(index*rowSize, rowSize)
                  .map(i => {
                    const card = flatList[i]
                    if (!card) return <div key="none" className="w-60"></div>

                    return <div key={card.id}>
                      {card.image_uris && <Image
                        className="magic-card h-auto"
                        src={card.image_uris?.normal || card.image_uris.png}
                        height={320}
                        width={240}
                        alt={card.name}
                      />}
                    </div>
                  })
                }</div>
              )}
              onReachBottom={fetchNextPage}
              isFetching={isFetching}
            />
          }
        </>
      }
      
      {!data?.pages?.length && <div>No cards found</div>}
    </section>
  )
}

export type SearchOutputType = typeof SearchOutput