import "@app/globals.css"
import { Inter } from "next/font/google"

import { Providers } from "@app/providers"
import { Header } from "@widgets/Header"
import { cn } from "@shared/lib/utils"

const font = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MTG Builder",
  description: "A magic place for everyone to browse MTG cards and build decks.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          font.className,
          "[--layout-header-vh:3rem] [--layout-main-vh:calc(100dvh_-_var(--layout-header-vh))]",
          "[--layout-main-content-max-w:64rem]"
        )}
      >
        {/* header */}
        <Header />

        <main className="flex min-h-[--layout-main-vh]">
          <Providers>{children}</Providers>
        </main>

        <div id="portal-root" className="fixed top-0 left-0 w-full h-0 z-10"></div>
      </body>
    </html>
  )
}
