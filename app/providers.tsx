"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "react-query"
import type { PropsWithChildren } from "react"

const queryClient = new QueryClient()

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
