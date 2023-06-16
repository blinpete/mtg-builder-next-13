import * as Scry from "scryfall-sdk";

export async function search(query: string) {
  // "use server"
  
  const data =  await Scry.Cards.search(query, {
    dir: 'auto',
    include_multilingual: false,
    include_variations: false,
    order: 'set',
    unique: 'art',
  }).cancelAfterPage().waitForAll()
  
  // console.log("🚀 | search | data:", data)

  return data
}