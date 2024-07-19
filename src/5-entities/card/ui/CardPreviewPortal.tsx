import { createPortal } from "react-dom"
import { CardPreview } from "./CardPreview"
import type { CardPreviewProps } from "./CardPreview"

export function CardPreviewPortal({ card, onClick }: Pick<CardPreviewProps, "card" | "onClick">) {
  const portalNode = document.getElementById("portal-root")

  return (
    portalNode &&
    createPortal(
      <CardPreview
        showChampionButtons={false}
        isInDeck={false}
        height="100dvh"
        card={card}
        onClick={onClick}
      />,
      portalNode,
      "CardPreview"
    )
  )
}
