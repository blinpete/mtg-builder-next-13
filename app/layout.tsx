import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from './navbar'
import { Providers } from './providers'

const font = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MTG Builder',
  description: 'A magic place for everyone to browse MTG cards and build decks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main className="pt-16 flex flex-col items-center justify-center" style={{minHeight: "calc(100vh - 0.75rem)"}}>
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            {/* header */}
            <div className="
              fixed left-0 top-0 w-full
              flex justify-center h-12 items-center
              border-t
              border-b border-gray-300 bg-gradient-to-b from-zinc-200
              backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit
              lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
              <Navbar />
            </div>

            {/* footer */}
            {/* <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                By{' '}
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </div> */}
          </div>

          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
