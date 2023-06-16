// "use client"

/**
 * Scryfall routes
 * https://github.com/ChiriVulpes/scryfall-sdk/blob/main/ROUTES.md
 * 
 * layout example
 * https://scryfall.com/sets/eld
 * https://scryfall.com/sets/mh1
 * https://scryfall.com/sets/rna
 * https://scryfall.com/sets/som
 * https://scryfall.com/sets/m11
 * 
 * advanced search
 * https://scryfall.com/search?as=grid&order=name&q=type%3Acreature+set%3Amat
 * 
 * sets
 * https://scryfall.com/sets
 * 
 * 
 * https://magic.wizards.com/en/formats
 * https://gatherer.wizards.com/Pages/Default.aspx
 */

import Image from "next/image";
import { search } from "./scryfall";
import type { SearchResponse } from "../api/search/route";

export default async function Search() {
  // const [cards, setCards] = useState([] as Scry.Card[])
  // const [isLoading, setIsLoading] = useState(false)

  // setIsLoading(true)
  // const magicEmitter = Scry.Cards.search('-t:planeswalker', {
  //   dir: 'auto',
  //   include_multilingual: false,
  //   include_variations: false,
  //   order: 'set',
  // })
  // const data = (await magicEmitter.all().next()).value

  // Scry.Cards.bySet()
  // const data = await search('set:eld')
  // const data = await search('-t:planeswalker')
  const response = await fetch('http://localhost:3000/api/search?order=set&q=set:eld+color:B', {method: 'GET'})
  // console.log("🚀 | Search | data:", data)
  const {data, error} = await response.json() as SearchResponse

  if (!data) return 'not found'

  return <section>
    <p>cards found: {data.length}</p>

    <ul style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.35rem',
      rowGap: '0.5rem',
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
}