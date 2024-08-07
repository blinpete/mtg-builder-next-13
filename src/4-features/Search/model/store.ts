import { create } from "zustand"

type Store = {
  query: string
  setQuery: (q: string) => void
}

export const useStoreSearchQuery = create<Store>()(set => ({
  query: "",
  setQuery: q => set({ query: q }),
}))
