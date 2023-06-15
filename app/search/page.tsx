/**
 * Scryfall routes
 * https://github.com/ChiriVulpes/scryfall-sdk/blob/main/ROUTES.md
 * 
 * layout example
 * https://scryfall.com/sets/mat
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import * as Scry from "scryfall-sdk";


export function Search() {
  const [cards, setCards] = useState([] as Scry.Card[])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchCards() {
      setIsLoading(true)
      // const magicEmitter = Scry.Cards.search('-t:planeswalker', {
      //   dir: 'auto',
      //   include_multilingual: false,
      //   include_variations: false,
      //   order: 'set',
      // })
      // const data = (await magicEmitter.all().next()).value

      // Scry.Cards.bySet()
      const data = await Scry.Cards.search('-t:planeswalker', {
        dir: 'auto',
        include_multilingual: false,
        include_variations: false,
        order: 'set',
      }).cancelAfterPage().waitForAll()
      
      console.log("🚀 | fetchCards | card:", data[0])

      setIsLoading(false)

      if (!ignore) {
        if (data) setCards(x => [...x, ...data])
      }
    }


    fetchCards()

    return () => {
      ignore = true
    }
  }, [])
  
  return <section>
    <h2>Catalog component</h2>

    <p>
      isLoading: {''+isLoading}
    </p>

    <h3>cards:</h3>
    <ul style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0.3rem',
      listStyle: 'none'
    }}>
      {cards.map(s => <li key={s.id}>
        {/* {s.name} */}
        {s.image_uris?.normal && <Image
          className="magic-card"
          src={s.image_uris?.normal}
          width={240}
          style={{borderRadius: '0.7rem'}}
          alt={s.name}
        />}
      </li>)}
    </ul>
  </section>
}