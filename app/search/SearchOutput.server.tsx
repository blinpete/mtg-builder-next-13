import Image from 'next/image'
import * as Scry from 'scryfall-sdk'

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
  const searchOptions = Object.entries(props.options || {}).reduce((acc, [k,v]) => acc+`&${k}=${v}`, '')
  const response = await fetch(`https://api.scryfall.com/cards/search?${searchOptions}&q=${props.query}`)
  const json = await response.json() as {
    object: "list"
    total_cards: number
    has_more: boolean
    next_page: string // url with ?page=NEXT_PAGE
    data: Scry.Card[]
  }

  const data = json.data
  const prevPage = (props.options?.page || 1 ) - 1

  // const emitter = Scry.Cards.search(props.query, {page: 2})
  // emitter.on('data', card => {
  //   console.log("🚀 | card:", card.name)
  //   data.push(card)
  // })
  // await emitter.waitForAll()
  

  return (
    <section>
      <p className="
        text-center text-zinc-600 text-sm
      ">{prevPage*175 + 1} - {prevPage*175 + data.length} of {json.total_cards} cards</p>
      {/* <p>has more: {''+json.has_more}</p> */}
      <ul style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.4rem',
        rowGap: '0.6rem',
        listStyle: 'none'
      }}>
        {data.map(card => <li key={card.id}>
          {/* {s.name} */}
          {card.image_uris?.normal && <Image
            className="magic-card"
            src={card.image_uris?.normal}
            height={320}
            width={240}
            alt={card.name}
          />}
        </li>)}
      </ul>
    </section>
  )
}

export type SearchOutputType = typeof SearchOutput