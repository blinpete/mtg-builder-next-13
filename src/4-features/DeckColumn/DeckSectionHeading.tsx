export function DeckSectionHeading({ title }: { title: string }) {
  return (
    <h1 className="text-xs flex gap-2 pl-3 pr-4 items-center text-zinc-600/60">
      <hr className="flex-grow border-zinc-600/30" />
      <span>{title}</span>
      <hr className="flex-grow border-zinc-600/30" />
    </h1>
  )
}
