## MTG Builder

_"Magic: The Gathering"_ deck builder.

Okay we are not here to talk about docs or smth.. just dive into [this search query](https://mtgdecks.vercel.app/search?q=set:eld+c:b+order:set+unique:art+lang:en) and enjoy _magic_.

Here's a quick guide to the Scryfall syntax:
- `set:eld` - cards from "Throne of Eldraine" set
- `color:b` - cards that are black
- `unique:art` - cards with unique arts
- `order:set` - sort by set
- `lang:en` - cards in English

For the full guide, follow the [Scryfall docs](https://scryfall.com/docs/syntax).

Bulit with

- [Next.js](https://nextjs.org/blog/next-13-4) app router and RSC
- [Scryfall API](https://scryfall.com/docs/api) to access and search through MTG Card Database
- [`next/image`](https://nextjs.org/docs/app/building-your-application/optimizing/images) to optimize and cache MTG card images.

## Run locally

```bash
# run the development server
pnpm dev

# build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
