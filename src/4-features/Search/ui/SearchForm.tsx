"use client"

import { useEffect, useRef } from "react"

import { Input } from "@shared/ui"

import type { FormEventHandler } from "react"

type Props = {
  query: string | null
  onSubmit: FormEventHandler<HTMLFormElement>
}
export function SearchForm(props: Props) {
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
          <Input
            required
            ref={inputRef}
            type="text"
            name="search"
            className="w-full"
            placeholder="set:eld c:black order:set unique:art"
          />
        </label>
      </form>
    </>
  )
}
