"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

type NavLink = {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/sets", label: "Sets" },
  { href: "/decks", label: "Decks" },
  { href: "/auth/register", label: "Register" },
  { href: "/auth/login", label: "Login" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2">
      {navLinks.map(link => {
        // const isActive = pathname.startsWith(link.href)
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={(isActive ? "text-orange-400 " : "") + "hover:underline"}
          >
            {link.label}
          </Link>
        )
      })}
      <button onClick={() => signOut()}>Logout</button>
    </nav>
  )
}
