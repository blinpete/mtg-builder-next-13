import './globals.css'
import { Inter } from 'next/font/google'

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
      <body className={font.className}>{children}</body>
    </html>
  )
}
