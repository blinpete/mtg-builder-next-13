import { cn } from "@shared/lib/utils"
import type { Card } from "@shared/types"

type Props = {
  card: Card
  addCard?: (card: Card) => void
  removeCard?: (id: Card["id"]) => void

  counters?: Record<string, number>

  /**
   * Controls add/remove buttons visibility.
   */
  visible: boolean
}
export function CardDotCounter(props: Props) {
  const card = props.card

  return (
    props.counters && (
      <div
        className="
        h-5 px-1 mb-0.5
        border-0 border-black
        flex flex-row items-center justify-center gap-1.5
      "
      >
        {props.visible && (
          <button
            className="
              h-5 w-5 rounded-md mr-auto
              bg-gray-400/50 font-bold
              flex items-center justify-center
              hover:opacity-90
              disabled:opacity-40
            "
            disabled={!props.counters[card.id]}
            onClick={() => {
              props.removeCard?.(card.id)
            }}
          >
            -
          </button>
        )}

        {props.counters[card.id] &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={card.id + "count_" + i}
              className={cn(
                "h-2 w-2 rounded-full",
                props.counters![card.id] > i
                  ? "bg-orange-600 border-2 border-orange-700"
                  : "bg-slate-400 border border-zinc-200/80"
              )}
            ></div>
          ))}
        {props.visible && (
          <button
            className="
              h-5 w-5 rounded-md ml-auto
              bg-gray-400/50 font-bold
              flex items-center justify-center
              hover:opacity-90
            "
            onClick={() => {
              props.addCard?.(card)
            }}
          >
            +
          </button>
        )}
      </div>
    )
  )
}
