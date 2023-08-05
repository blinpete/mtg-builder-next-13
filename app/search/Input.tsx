import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import type { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        `px-2 py-1.5 rounded-md
        bg-zinc-400 text-gray-800
        outline-none border-2 border-transparent
        focus:border-slate-500
        focus:ring-transparent
      `,
        props.className
      )}
    ></input>
  )
})
