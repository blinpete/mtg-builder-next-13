"use client"

import { ThemeProvider } from "next-themes"
import { type PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "./auth/contexts/AuthProvider"
import { DeckProvider } from "./search/DeckContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <AuthProvider>
          <DeckProvider>{children}</DeckProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
