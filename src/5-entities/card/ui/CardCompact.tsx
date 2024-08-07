/**
 * Compact card representation for sidebar stack.
 */
import Image from "next/image"

import { cn } from "@shared/lib/utils"
import type { Card } from "@shared/types"

import type { PropsWithChildren } from "react"

type Props = {
  card: Card
  onClick: () => void
  slotControls?: JSX.Element | null
  slotLeftCorner?: JSX.Element
}

export function CardCompact({ card, onClick, slotControls, slotLeftCorner }: Props) {
  return (
    <li className="relative max-w-xs min-w-[90%]" onClick={onClick}>
      {slotLeftCorner !== undefined && (
        <div
          className="
            absolute -top-1 -left-0.5
            bg-black text-stone-300
            w-4 h-4 rounded-full font-bold
            flex items-center justify-center
          "
          style={{ fontSize: "0.6rem" }}
        >
          {slotLeftCorner}
        </div>
      )}
      <div
        className="overflow-hidden w-full aspect-[100/18]"
        style={{
          borderBottom: "solid 0.6rem black",
          borderRadius: "0.6rem",
        }}
      >
        {card.image_uris && (
          <Image
            className={cn("magic-card h-auto w-full")}
            src={card.image_uris?.normal || card.image_uris.png}
            height={320}
            width={240}
            alt={card.name}
          />
        )}
        {slotControls}
      </div>
    </li>
  )
}

export function CardCompactButton({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      className="
        bg-black text-gray-200 font-bold
        w-8 h-3/4 rounded-t-none rounded-md
        hover:h-4/5
      "
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}
