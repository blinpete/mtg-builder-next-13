import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@shared/lib/utils"
import { Navbar } from "./navbar"
import { Providers } from "./providers"

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
          "[--layout-header-vh:3rem] [--layout-main-vh:calc(100dvh_-_var(--layout-header-vh))]"
        )}
      >
        {/* header */}
        <div
          className="
          w-full
          flex justify-center h-[--layout-header-vh] items-center
          bg-gradient-to-b from-zinc-900/95 to-zinc-800/95
          text-zinc-200
          "
        >
          <Navbar />
        </div>

        <main className="flex flex-col items-center min-h-[--layout-main-vh]">
          <Providers>{children}</Providers>
        </main>

        <div id="portal-root" className="fixed top-0 left-0 w-full h-0 z-10"></div>
      </body>
    </html>
  )
}
