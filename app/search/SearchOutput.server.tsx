import Image from 'next/image'
import * as Scry from 'scryfall-sdk'
import { Pagination } from './Pagination'

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

/**
 * https://scryfall.com/docs/api
 */
export async function SearchOutput(props: {
  query?: string
  options?: Scry.SearchOptions
}) {
  console.log("🚀 | SearchOutput | query:", props.query)
  console.log("🚀🚀🚀 | SearchOutput | options:", props.options)

  if (!props.query) return <div>empty query</div>

  // https://scryfall.com/docs/api/lists
  // GET https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1
  function searchParams(pairs: Record<string, any>) {
    return Object.entries(pairs).reduce((acc, [k,v]) => acc+`&${k}=${v}`, `q=${props.query}`)
  }

  const response = await fetch(`https://api.scryfall.com/cards/search?${searchParams(props.options || {})}`)
  const json = await response.json() as {
    object: "list"
    total_cards: number
    has_more: boolean
    next_page: string // url with ?page=NEXT_PAGE
    data: Scry.Card[]
  }

  const data = json.data

  const page = (props.options?.page || 1 )
  const prevPage = page - 1

  // const nextPageParams = searchParams({...(props.options || {}), page: page + 1})

  // const emitter = Scry.Cards.search(props.query, {page: 2})
  // emitter.on('data', card => {
  //   console.log("🚀 | card:", card.name)
  //   data.push(card)
  // })
  // await emitter.waitForAll()
  

  return (
    <section>
      {data && <>
          <p className="
            text-center text-zinc-600 text-sm
          ">{prevPage*175 + 1} - {prevPage*175 + data.length} of {json.total_cards} cards</p>
          <Pagination needNext={json.has_more} />

          <ul style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.4rem',
            rowGap: '0.6rem',
            listStyle: 'none'
          }}>
            {data.map(card => <li key={card.id}>
              {card.image_uris?.normal && <Image
                className="magic-card"
                src={card.image_uris?.normal}
                height={320}
                width={240}
                alt={card.name}
              />}
            </li>)}
          </ul>
        </>
      }
      
      {!data && <div>No cards found</div>}
    </section>
  )
}

export type SearchOutputType = typeof SearchOutput