import type { DeckRecord } from "@shared/types"

export function hashChampions(champions: DeckRecord["champions"]): string {
  return champions.reduce((acc, x) => acc + "__" + x.id, "")
}
