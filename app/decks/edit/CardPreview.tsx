import Image from "next/image"
import { useEffect, useState } from "react"
import { ScryRulings } from "@/app/search/ScryfallAPI"
import { cn } from "@/lib/utils"
import type { Card, Ruling } from "scryfall-sdk"

type Props = {
  card: Card
  onClick: () => void
}

export function CardPreview({ card, onClick }: Props) {
  const [rulings, setRulings] = useState<Ruling[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!card) return

    const ac = new AbortController()
    setIsLoading(true)

    ScryRulings(card.rulings_uri, ac.signal)
      .then(response => {
        setRulings(response.data)
      })
      .finally(() => setIsLoading(false))

    return () => ac.abort()
  }, [card])

  return (
    <div
      className="
        bg-gray-600/95 backdrop-blur-0 text-gray-200
        flex flex-row gap-5 px-3
        fixed top-12 bottom-0 left-64 right-0
        cursor-pointer
      "
      onClick={onClick}
    >
      <div className="flex flex-col justify-center flex-shrink-0">
        {card.image_uris && (
          <Image
            className={cn("magic-card h-auto w-max")}
            src={card.image_uris?.normal || card.image_uris.png}
            height={320}
            width={240}
            style={{
              height: "min(90%, 400px)",
            }}
            alt={card.name}
          />
        )}

        {/* <div>{card.flavor_text}</div> */}
        {/* <div>rarity: {card.rarity}</div> */}
      </div>
      <div className="overflow-scroll my-auto" style={{ maxHeight: "calc(100vh - 3rem)" }}>
        <div className="flex flex-col justify-center gap-2 py-10">
          {card.keywords.length ? (
            <>
              <hr className="opacity-25" />
              <div>
                <span className="font-bold mb-3">Keywords: </span>
                {card.keywords.map(k => (
                  <span key={card.id + k}>{k + " "}</span>
                ))}
              </div>
              <hr className="opacity-25" />
            </>
          ) : null}

          <h2 className="font-bold mb-3">Rulings:</h2>
          {isLoading ? (
            <div>loading...</div>
          ) : (
            rulings.map((r, i) => (
              <div key={card.id + "rule_" + i}>
                <p>{r.comment}</p>
                <p>({r.published_at})</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
