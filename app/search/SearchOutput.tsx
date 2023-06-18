"use client"

import Image from 'next/image'
import type Scry from 'scryfall-sdk'
import { Pagination } from './Pagination'
import { useEffect, useState } from 'react';

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

/**
 * https://scryfall.com/docs/api
 */
export async function SearchOutput(props: {
  query: string
  options?: Scry.SearchOptions
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

  const page = parseInt(''+props.options?.page || '1')
  const prevPage = page - 1
  const [json, setJson] = useState<ScrySearchResponse>()

  useEffect(() => {
    async function fetchData() {
      const json = await ScrySearch(props.query, props.options)
      setJson(json)
      
      // cache forced prefetch
      ScrySearch(props.query || '', {...(props.options || {}), page: page + 1})
        .then(json => {
          console.log("🚀 prefetch | json:", json)
    
          // if (json.data) json.data.forEach(card => {      
          //   if (card.image_uris?.normal) {
          //     console.log("🚀 prefetch | card:", card.name)
          //     fetch(card.image_uris.normal, {cache: 'force-cache'})
          //   }
          // })
    
          // if (json.data) preload(json.data.map(card => card.image_uris?.normal).filter(Boolean))
        })
    }

    fetchData()
  }, [props.query, props.options, page])

  
  return (
    <section>
      {json?.data && <>
          <p className="
            text-center text-zinc-600 text-sm
          ">{prevPage*175 + 1} - {prevPage*175 + json.data.length} of {json.total_cards} cards</p>
          <Pagination needNext={json.has_more} />

          <ul
            className="
              mt-4 list-none
              grid grid-cols-2 gap-x-1.5 gap-y-2.5
              md:grid-cols-4
              sm:grid-cols-3
            "
          >
            {json.data.map(card => <li key={card.id}>
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
      
      {!json?.data && <div>No cards found</div>}
    </section>
  )
}

export type SearchOutputType = typeof SearchOutput