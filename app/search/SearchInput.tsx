"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  console.log("🚀 | SearchInput | searchParams:", searchParams)

  // const order = searchParams.get("order")
  // const direction = searchParams.get("dir")
  const query = searchParams.get("q")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = query || ""
    }
  }, [query])

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault()
          const q = (e.target as unknown as { search: HTMLInputElement }).search.value.replaceAll(
            " ",
            "+"
          )
          router.push(`${pathname}?q=${q}&page=1`)
        }}
        className="w-full px-5 my-2"
      >
        <label>
          <input
            ref={inputRef}
            name="search"
            className="
              px-2 py-1.5 outline-none rounded-md
              border-2 border-transparent
              focus:border-slate-500
              bg-zinc-400 text-gray-800
              w-full
            "
          ></input>
        </label>
      </form>
    </>
  )
}
