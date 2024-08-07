import { create } from "zustand"

import type { Card } from "@shared/types"

type Store = {
  card: Card | null
  setCard: (card: Card | null) => void
  isActiveCard: (card: Card["id"]) => boolean
}

export const useStoreActiveCard = create<Store>()((set, get) => ({
  card: null,
  setCard: card => set({ card }),
  isActiveCard: id => id == get().card?.id,
}))
