import { SearchInput } from "./SearchInput.client";
import { SearchOutput } from "./SearchOutput.server";

/**
 * #### Scryfall routes
 * https://github.com/ChiriVulpes/scryfall-sdk/blob/main/ROUTES.md
 * 
 * #### sets
 * - https://scryfall.com/sets
 * - https://scryfall.com/sets/eld
 * - https://scryfall.com/sets/mh1
 * - https://scryfall.com/sets/rna
 * - https://scryfall.com/sets/som
 * - https://scryfall.com/sets/m11
 * 
 * #### advanced search examples
 * - https://scryfall.com/search?as=grid&order=name&q=type%3Acreature+set%3Amat
 * - https://gatherer.wizards.com/Pages/Default.aspx
 * 
 * #### formats
 * https://magic.wizards.com/en/formats
 */
export default async function Search({searchParams}: {
  searchParams?: {
    q?: string
  };
}) {
  return (
    <>
      <SearchInput />
      <SearchOutput query={searchParams?.q}/>
    </>
  )
}