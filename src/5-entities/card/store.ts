import { create } from "zustand"
import type { Card } from "@shared/types"

type Store = {
  card: Card | null
  setCard: (card: Card | null) => void
}

export const useStoreActiveCard = create<Store>()(set => ({
  card: null,
  setCard: card => set({ card }),
}))
