'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

type NavLink = {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  {href: '/', label: 'Home'},
  {href: '/search', label: 'Search'},
  {href: '/sets', label: 'Sets'},
]

export function Navbar() {
  const pathname = usePathname()

  return (<nav className="flex gap-2">
    {navLinks.map(link => {
      // const isActive = pathname.startsWith(link.href)
      const isActive = pathname === link.href

      return <Link
        key={link.href}
        href={link.href}
        className={
          (isActive ? 'text-orange-400 ' : '')
          + 'hover:underline'
        }
      >{link.label}</Link>
    })}
  </nav>)
}