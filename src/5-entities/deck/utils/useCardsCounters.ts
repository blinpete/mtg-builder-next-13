import { useMemo } from "react"

import type { CardEntry } from "@shared/types"

export function useCardsCounters(cards: CardEntry[] | undefined) {
  const counters = useMemo(() => {
    if (!cards) return
    return Object.fromEntries(cards.map(x => [x.card.id, x.count]))
  }, [cards])

  return counters
}
