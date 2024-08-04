import type { Card } from "@shared/types"
import type { Dispatch, SetStateAction } from "react"

export type SetActiveCardAction = Dispatch<SetStateAction<Card | null>>
