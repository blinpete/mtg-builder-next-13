import type Scry from 'scryfall-sdk'
export type * as Scry from 'scryfall-sdk'

export type ScrySearchResponse = {
  object: "list"
  total_cards: number
  has_more: boolean
  next_page: string // url with ?page=NEXT_PAGE
  data: Scry.Card[]
}

/**
 * Docs:
 * https://scryfall.com/docs/api/lists
 * 
 * Example:
 * GET https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1
*/
export async function ScrySearch(query: string, options?: Scry.SearchOptions) {
  const searchParams = Object
    .entries(options || {})
    .reduce((acc, [k,v]) => acc+`&${k}=${v}`, `q=${query}`)

  const response = await fetch(`https://api.scryfall.com/cards/search?${searchParams}`)
  const json = await response.json() as ScrySearchResponse

  return json
}