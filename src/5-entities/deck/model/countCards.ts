import type { CardEntry } from "@shared/types"

export function countCards(cards?: CardEntry[]) {
  if (!cards) return 0
  return cards.reduce((acc, x) => acc + x.count, 0)
}
