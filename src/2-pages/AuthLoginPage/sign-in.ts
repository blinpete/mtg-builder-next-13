import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"

import type { LoginData } from "@shared/auth"

export async function handleSignIn(data: LoginData) {
  const result = await signIn("credentials", {
    ...data,
    redirect: false,
  })

  if (result?.error) {
    toast.error(`Error: ${result.error}`)
  } else {
    toast.success("Successful logged in")
  }
}
