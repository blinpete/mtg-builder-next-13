import Image from 'next/image'
import Link from 'next/link'
import * as Scry from 'scryfall-sdk'
import { GenericTable } from './GenericTable'

// https://ui.shadcn.com/docs/components/data-table

export default async function Sets() {
  // const data = await Scry.setFuzzySearch()
  const data = await Scry.Sets.all()
  data.length = 10

  return <>
    <GenericTable
      rows={data}
      getId={item => item.id}
      columns={[
        {
          label: 'Icon',
          cellFn: item => (
            <div className='bg-white w-8 h-8 rounded-md flex justify-center items-center'>
              <object type="image/svg+xml" data={item.icon_svg_uri} className="w-6 h-6">  
                {/* {item.name} */}
              </object>
            </div>
          ),
        },
        {
          label: 'Name',
          cellFn: item => (
            <Link href={`/sets/${item.id}`}>{item.name}</Link>
          ),
        },
        {
          label: 'Cards',
          cellFn: item => item.card_count,
        },
        // {
        //   label: 'Code',
        //   cellFn: item => item.code,
        // },
        {
          label: 'Release date',
          cellFn: item => item.released_at
        },
      ]}
    />
  </>
}