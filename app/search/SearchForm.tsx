"use client"

import { useEffect, useRef } from "react"
import type { FormEventHandler } from "react"

type Props = {
  query: string | null
  onSubmit: FormEventHandler<HTMLFormElement>
}
export function SearchForm(props: Props) {
  console.log("🚀 | SearchForm")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.query || ""
    }
  }, [props.query])

  return (
    <>
      <form onSubmit={props.onSubmit} className="w-full px-5 my-2">
        <label>
          <input
            ref={inputRef}
            name="search"
            className="
              px-2 py-1.5 outline-none rounded-md
              border-2 border-transparent
              focus:border-slate-500
              focus:ring-transparent
              bg-zinc-400 text-gray-800
              w-full
            "
          ></input>
        </label>
      </form>
    </>
  )
}
