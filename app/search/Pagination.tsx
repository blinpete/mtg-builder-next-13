"use client"

// import Link from "next/link"
// import { usePathname, useSearchParams } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"

export function Pagination(props: {
  hasPrev: boolean
  hasNext: boolean
  setPage: Dispatch<SetStateAction<number>>
}) {
  // console.log("🚀 | Pagination | needNext:", needNext)

  return (
    <div className="flex gap-2 justify-end mx-5">
      <button
        className="px-2 py-0.5 rounded-sm bg-slate-400 hover:opacity-80 disabled:opacity-30"
        onClick={() => props.setPage(1)}
        disabled={!props.hasPrev}
      >
        0
      </button>
      <button
        className="px-2 py-0.5 rounded-sm bg-slate-400 hover:opacity-80 disabled:opacity-30"
        onClick={() => props.setPage(n => n - 1)}
        disabled={!props.hasPrev}
      >
        prev
      </button>
      <button
        className="px-2 py-0.5 rounded-sm bg-slate-400 hover:opacity-80 disabled:opacity-30"
        onClick={() => props.setPage(n => n + 1)}
        disabled={!props.hasNext}
      >
        next
      </button>
    </div>
  )
}
