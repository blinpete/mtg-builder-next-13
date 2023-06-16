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
 */

import Image from "next/image";
import { search } from "./scryfall";
// import { useState } from "react";

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
  const data = await search('set:eld')
  // const data = await search('-t:planeswalker')
  // const data = await fetch('search/scryfall?q=-t:planeswalker')
  // console.log("🚀 | Search | data:", data)

  // setIsLoading(false)

  // if (data) setCards(x => [...x, ...data])

  return <section>
    {/* <p>
      isLoading: {''+isLoading}
    </p> */}
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
          style={{
            borderRadius: '4.75% / 3.5%',
            fontSize: '14px',
            boxShadow: '1px 1px 4px hsl(0deg 0.61% 24.97% / 90%)',
          }}
          alt={card.name}
        />}
      </li>)}
    </ul>
  </section>
}