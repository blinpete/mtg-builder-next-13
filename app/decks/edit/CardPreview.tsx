// import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDeck } from "@/app/search/DeckContext"
import { ScryRulings } from "@/app/search/ScryfallAPI"
import { cn } from "@/lib/utils"
import type { Card, Ruling } from "scryfall-sdk"

type Props = {
  card: Card
  isInDeck: boolean
  showChampionButtons: boolean
  height: string
  onClick: () => void
}

export function CardPreview({ card, isInDeck, showChampionButtons, height, onClick }: Props) {
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

    return () => ac.abort()
  }, [card])

  // ------------------------------------------------------------------
  //                         handle champions
  // ------------------------------------------------------------------
  const { deck } = useDeck()

  const handleAddChampion = useCallback(() => {
    if (!deck?.addChampion) return
    return deck.addChampion(card)
  }, [deck, card])

  const handleRemoveChampion = useCallback(() => {
    if (!deck?.removeChampion) return
    return deck.removeChampion(card.id)
  }, [deck, card.id])

  const canAddChampion = useMemo(() => {
    return isInDeck && deck?.champions.findIndex(x => x.id === card.id) === -1
  }, [card.id, deck?.champions, isInDeck])

  const canRemoveChampion = useMemo(() => {
    return deck?.champions.findIndex(x => x.id === card.id) !== -1
  }, [card.id, deck?.champions])

  // ------------------------------------------------------------------

  return (
    <div
      className="
        bg-gray-600/95 backdrop-blur-0 text-gray-200
        absolute left-0 top-0 w-full
        cursor-pointer
        overflow-auto
      "
      style={{ height }}
      onClick={onClick}
    >
      {showChampionButtons && (
        <div className="py-3 px-4 flex gap-1 justify-center text-sm">
          <button
            className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
            disabled={!canAddChampion}
            onClick={e => {
              e.stopPropagation()
              handleAddChampion()
            }}
          >
            Add to champions
          </button>
          <button
            className="px-2 py-0.5 rounded-sm bg-orange-400 hover:opacity-80 disabled:opacity-30"
            disabled={!canRemoveChampion}
            onClick={e => {
              e.stopPropagation()
              handleRemoveChampion()
            }}
          >
            Remove from champions
          </button>
        </div>
      )}

      <div className="h-full flex flex-row">
        <div className="flex flex-col flex-grow justify-center items-end flex-shrink-0 px-2">
          {card.image_uris && (
            <Image
              className="magic-card h-[clamp(70vh,28rem,90vh)] w-max"
              src={card.image_uris?.normal || card.image_uris.png}
              height={320}
              width={240}
              alt={card.name}
            />
          )}
        </div>
        <div
          className="
            max-h-full my-auto px-2
            flex justify-center flex-grow basis-[36rem]
            overflow-y-auto
          "
        >
          {/* <div className="mt-3 flex flex-col items-center gap-6">
            <div>{<ChevronDown />}</div>
            <span>
              More about <strong>{card.name}</strong>
            </span>
          </div> */}

          <div className="flex flex-col gap-3 h-max w-full my-10 max-w-[36rem]">
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
