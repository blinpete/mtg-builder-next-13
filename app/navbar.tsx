'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

type NavLink = {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  {href: '/sets', label: 'Sets'},
]

export function Navbar() {
  const pathname = usePathname()

  return (<nav>
    {navLinks.map(link => {
      const isActive = pathname.startsWith(link.href)

      return <Link
        key={link.href}
        href={link.href}
        className={
          (isActive ? 'text-blue-500' : '')
          + 'hover:underline'
        }
      >{link.label}</Link>
    })}
  </nav>)
}