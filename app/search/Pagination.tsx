"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export function Pagination({needNext}: {needNext: boolean}) {
  // console.log("🚀 | Pagination | needNext:", needNext)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1')
  const prev = page - 1
  const next = page + 1

  let newParams = ''
  searchParams.forEach((v,k) => {
    if (k !== 'page') newParams += `${k}=${v}&`
  })
  newParams += 'page='


  return (
    <div className="flex gap-2">
      {prev > 0
        ? <Link href={`${pathname}?${newParams + prev}`}>Prev</Link>
        : <span className="opacity-40">Prev</span>
      }
      {needNext
        ? <Link href={`${pathname}?${newParams + next}`}>Next</Link>
        : <span className="opacity-40">Next</span>
      }
    </div>
  )
}