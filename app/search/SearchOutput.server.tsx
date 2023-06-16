import Image from 'next/image'
import * as Scry from 'scryfall-sdk'

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export async function SearchOutput({query}: {query?: string}) {
  console.log("🚀 | SearchOutput | query:", query)

  if (!query) return <div>empty query</div>

  const data =  await Scry.Cards.search(query, {
    dir: 'auto',
    include_multilingual: false,
    include_variations: false,
    order: 'set',
    unique: 'art',
  }).cancelAfterPage().waitForAll()

  return (
    <section>
      <p>cards found: {data.length}</p>

      <ul style={{
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