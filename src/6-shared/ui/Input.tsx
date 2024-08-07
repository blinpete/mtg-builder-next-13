import { forwardRef } from "react"

import { cn } from "@shared/lib/utils"

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
        placeholder:opacity-60
      `,
        props.className
      )}
      style={{
        // https://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete
        WebkitTextFillColor: "rgb(31 41 55)",
        caretColor: "rgb(31 41 55)",
        // WebkitBackgroundClip: "border-box",
        // WebkitBoxShadow: "0 0 0 30px rgb(31 41 55 / 10%) inset !important",
        WebkitBoxShadow: "none",
      }}
    ></input>
  )
})
