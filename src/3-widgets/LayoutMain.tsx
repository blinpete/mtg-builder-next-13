import { cn } from "@shared/lib/utils"

import type { CSSProperties, PropsWithChildren } from "react"

type Props = PropsWithChildren & {
  className?: string
  style?: CSSProperties
}

export function LayoutMain(props: Props) {
  return (
    <div
      className={cn(
        `flex flex-col items-center
        w-full max-w-[--layout-main-content-max-w]
        mx-auto`,
        props.className
      )}
      style={props.style}
    >
      {props.children}
    </div>
  )
}
