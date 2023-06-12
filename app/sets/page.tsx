import Image from 'next/image'
import Link from 'next/link'
import * as Scry from 'scryfall-sdk'

// https://ui.shadcn.com/docs/components/data-table

export default async function Sets() {
  const data = await Scry.Sets.all()
  data.length = 5

  return <>
    <h1>Sets</h1>
    
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/sets/${item.id}`}>
            <div className='mt-4 bg-slate-100 w-8 h-8 rounded-md flex justify-center'>
              <object type="image/svg+xml" data={item.icon_svg_uri} className="w-6">  
                {/* {item.name} */}
              </object>
            </div>
            <div>{item.name}</div>
            <div>cards: {item.card_count}</div>
            <div>code: {item.code}</div>
            <div>released_at: {item.released_at}</div>
            
            {/* <div>id: {item.id}</div>
            <div>uri: {item.uri}</div>
            
            <div>scryfall uri: {item.scryfall_uri}</div>
            <div>search_uri: {item.search_uri}</div> */}
            
            {/* <div className='bg-slate-50 w-8 h-8 rounded-full flex justify-center'>
              <Image
                src={item.icon_svg_uri}
                alt={item.name}
                width={24}
                height={24}
              />
            </div> */}

            {/* <img src={item.icon_svg_uri} alt={item.name} width={10} height={10}/> */}
          </Link>
        </li>
      ))}
    </ul>
  </>
}