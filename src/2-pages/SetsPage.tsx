import Link from "next/link"
import * as Scry from "scryfall-sdk"

import { LayoutMain } from "@widgets/LayoutMain"
import { GenericTable } from "@entities/set"

/**
 * https://scryfall.com/sets
 */
export async function SetsPage() {
  // const data = await Scry.setFuzzySearch()
  const data = await Scry.Sets.all()
  data.length = 20

  return (
    <LayoutMain>
      <GenericTable
        rows={data}
        getId={item => item.id}
        columns={[
          {
            label: "Name",
            cellFn: item => (
              <div
                className="flex flex-row gap-2 items-center"
                style={{ minWidth: "min(60vw, 800px)" }}
              >
                <div className="bg-white w-8 h-8 rounded-lg flex justify-center items-center">
                  <object type="image/svg+xml" data={item.icon_svg_uri} className="w-6 h-6">
                    {/* {item.name} */}
                  </object>
                </div>
                <Link href={`/search?q=set:${item.code}+order:set+unique:art`}>{item.name}</Link>
                <pre className="opacity-40">{item.code.toUpperCase()}</pre>
              </div>
            ),
          },
          {
            label: "Cards",
            cellFn: item => item.card_count,
          },
          // {
          //   label: 'Code',
          //   cellFn: item => item.code,
          // },
          {
            label: "Date",
            cellFn: item => item.released_at,
          },
        ]}
      />
    </LayoutMain>
  )
}
