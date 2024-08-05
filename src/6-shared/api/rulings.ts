import type { ScrySearchError } from "./search"
import type Scry from "scryfall-sdk"

export type ScryRulingsResponse = {
  object: "list"
  has_more: boolean
  data: Scry.Ruling[]
}

export async function ScryRulings(url: string, signal?: AbortSignal) {
  // await new Promise(resolve => setTimeout(resolve, 1500))

  const response = await fetch(url, { signal: signal })
  const json = (await response.json()) as ScryRulingsResponse | ScrySearchError

  if (json.object === "error") throw json

  return json
}
