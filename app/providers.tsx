"use client"

import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
