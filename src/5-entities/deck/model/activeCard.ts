import type { Dispatch, SetStateAction } from "react"
import type { Card } from "scryfall-sdk"

export type SetActiveCardAction = Dispatch<SetStateAction<Card | null>>
