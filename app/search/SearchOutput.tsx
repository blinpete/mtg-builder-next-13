"use client"

import Image from 'next/image'
import { Pagination } from './Pagination'
import { useEffect, useState } from 'react';
import { ScrySearch, type ScrySearchResponse, type Scry } from './ScryfallAPI';

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
      // ScrySearch(props.query || '', {...(props.options || {}), page: page + 1})
      //   .then(json => {
      //     console.log("🚀 prefetch | json:", json)
    
      //     if (json.data) json.data.forEach(card => {      
      //       if (card.image_uris?.normal) {
      //         console.log("🚀 prefetch | card:", card.name)
      //         fetch(card.image_uris.normal, {cache: 'force-cache'})
      //       }
      //     })
      //   })
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
              mx-1 mt-4 list-none
              grid gap-x-1.5 gap-y-2.5
              grid-cols-2 
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
