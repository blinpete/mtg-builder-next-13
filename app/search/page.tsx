"use client"

import { SearchPage } from "@pages/SearchPage"
import type { SearchOptions } from "scryfall-sdk"

export default function Search(props: {
  searchParams?: {
    q?: string
  } & SearchOptions
}) {
  return <SearchPage {...props} />
}
