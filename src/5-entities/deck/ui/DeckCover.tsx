import Image from "next/image"

import type { DeckRecord } from "@shared/types"

export function DeckCover({ deck }: { deck: DeckRecord }) {
  return (
    <div
      className="
        w-24 h-32
        flex flex-col items-center overflow-hidden
        border-gray-800 rounded-md
        bg-gray-800
        shadow-md shadow-slate-500
        relative
      "
      style={{ borderWidth: "3px" }}
    >
      {deck.champions.length === 1 && (
        <Image
          src={deck.champions[0].image_uri}
          alt="Key card 1"
          width={240}
          height={320}
          style={{ maxHeight: "100%", maxWidth: "max-content" }}
        />
      )}

      {deck.champions.length >= 2 && (
        <>
          {deck.champions.map((x, i) => {
            if (i >= 2) return null

            return (
              <Image
                className="absolute"
                src={x.image_uri}
                key={`${deck.id}-keycard-${i}`}
                alt={`Key card ${i + 1}`}
                width={240}
                height={320}
                style={{
                  maxHeight: "60%",
                  maxWidth: "max-content",
                  top: `${40 * i}%`,
                  clipPath:
                    i === 0
                      ? "polygon(0 0, 100% 0, 100% 70%, 0 88%)"
                      : "polygon(0 25%, 100% 7%, 100% 100%, 0 100%)",
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
