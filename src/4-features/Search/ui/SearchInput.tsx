"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SearchForm } from "./SearchForm"

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  console.log("🚀 | SearchInput | searchParams:", searchParams)

  // const order = searchParams.get("order")
  // const direction = searchParams.get("dir")
  const query = searchParams.get("q")

  return (
    <SearchForm
      query={query}
      onSubmit={e => {
        e.preventDefault()
        const q = (e.target as unknown as { search: HTMLInputElement }).search.value.replaceAll(
          " ",
          "+"
        )

        router.push(`${pathname}?q=${q}&page=1`)
      }}
    />
  )
}
