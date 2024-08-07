// import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { ScryRulings } from "@shared/api"
import { cn } from "@shared/lib/utils"
import type { Card, Ruling } from "@shared/types"

import type { KeyboardEventHandler, ReactNode } from "react"

export type CardPreviewProps = {
  card: Card
  slotExtraContent?: ReactNode
  height: string
  onClick: () => void
}

export function CardPreview({ card, slotExtraContent, height, onClick }: CardPreviewProps) {
  const [rulings, setRulings] = useState<Ruling[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  console.log("🚀 | CardPreview | isLoading:", isLoading)

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    if (!card) return

    const ac = new AbortController()
    setIsLoading(true)

    ScryRulings(card.rulings_uri, ac.signal)
      .then(response => {
        setRulings(response.data)
      })
      .finally(() => setIsLoading(false))

    return () => ac.abort("No need, user navigated away")
  }, [card])

  const handleKeyEsc: KeyboardEventHandler = e => {
    if (e.key === "Escape") onClick()
  }

  // ------------------------------------------------------------------

  return (
    <div
      className={cn(
        "bg-gray-600/95 backdrop-blur-0 text-gray-200",
        "@container/main",
        "absolute left-0 top-0 w-full",
        "cursor-pointer",
        // note: scroll only for w < @3xl, after this bp we set fixed height and move scroll to the "About the card" container
        "overflow-y-auto",
        slotExtraContent
          ? "[--preview-header-vh:2.4rem] [--preview-main-vh:calc(100%_-_var(--preview-header-vh))]"
          : "[--preview-main-vh:100%]"
      )}
      style={{ height }}
      onClick={onClick}
    >
      {/* hidden input for keyboard events */}
      <input
        className="absolute top-0 left-0 opacity-0 h-0"
        readOnly // prevents mobile keyboard from showing up
        autoFocus
        onKeyDown={handleKeyEsc}
      />

      {slotExtraContent && <div className="h-[var(--preview-header-vh)]">{slotExtraContent}</div>}

      <div
        className="
          h-max flex flex-col
          @3xl/main:flex-row
          @3xl/main:h-[var(--preview-main-vh)]
        "
      >
        {/* card image */}
        <div
          className="
          flex justify-center items-center
          flex-grow flex-shrink-0
          px-2 py-6
          @3xl/main:justify-end
        "
        >
          {card.image_uris && (
            <Image
              className="
                magic-card w-max
                h-[clamp(60vmax,28rem,90vmax)]
                @3xl/main:h-[clamp(70vmin,28rem,90vmin)]
              "
              src={card.image_uris?.normal || card.image_uris.png}
              height={320}
              width={240}
              alt={card.name}
            />
          )}
        </div>

        {/* about the card */}
        <div
          className="
            my-auto px-5
            flex justify-center flex-grow
            @3xl/main:max-h-full
            @3xl/main:overflow-y-auto
            @3xl/main:px-2
            @3xl/main:basis-[36rem]
          "
        >
          {/* <div className="mt-3 flex flex-col items-center gap-6">
            <div>{<ChevronDown />}</div>
            <span>
              More about <strong>{card.name}</strong>
            </span>
          </div> */}

          <div
            className="
              flex flex-col gap-3
              h-max w-full max-w-[36rem]
              mt-2 mb-10
              @3xl/main:mt-10
            "
          >
            {/* keywords */}
            <>
              <hr className="opacity-25" />
              <div>
                <span className="font-bold mb-3">Keywords: </span>
                {!!card.keywords.length &&
                  card.keywords.map(k => <span key={card.id + k}>{k + " "}</span>)}
                {!card.keywords.length && <span>no keywords</span>}
              </div>
              <div>
                <span className="font-bold mb-3">Rarity: </span>
                {card.rarity}
              </div>
              <hr className="opacity-25" />
            </>

            <div className="flex gap-2">
              <h2 className="font-bold">Rulings:</h2>
              {isLoading && <div>loading...</div>}
              {!isLoading && rulings.length === 0 && <div>no rulings found</div>}
            </div>
            {!isLoading &&
              !!rulings.length &&
              rulings.map((r, i) => (
                <div key={card.id + "rule_" + i}>
                  <p>{r.comment}</p>
                  <p>({r.published_at})</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
