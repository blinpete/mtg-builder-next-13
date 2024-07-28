import { Navbar } from "@shared/ui"

export function Header() {
  return (
    <div
      className="
        w-full
        flex justify-center h-[--layout-header-vh] items-center
        bg-gradient-to-b from-zinc-900/95 to-zinc-800/95
        text-zinc-200
      "
    >
      <Navbar />
    </div>
  )
}
