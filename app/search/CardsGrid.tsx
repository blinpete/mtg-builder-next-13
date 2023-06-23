import Image from "next/image"
import type { Scry } from "./ScryfallAPI"

export function CardsGrid({ data }: { data: Scry.Card[] }) {
  return (
    <ul
      className="
        mx-1 mt-4 list-none
        grid gap-x-1.5 gap-y-2.5
        grid-cols-2
        md:grid-cols-4
        sm:grid-cols-3
      "
    >
      {data.map(card => (
        <li key={card.id}>
          {card.image_uris && (
            <Image
              className="magic-card h-auto"
              src={card.image_uris?.normal || card.image_uris.png}
              height={320}
              width={240}
              alt={card.name}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
