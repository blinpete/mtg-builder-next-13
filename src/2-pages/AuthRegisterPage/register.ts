import { toast } from "react-hot-toast"

import type { RegisterData } from "@shared/auth"
import type { ErrorJSON } from "@shared/types"

export async function registerUser(data: RegisterData) {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    console.log(response)
    if (response.status === 201) {
      toast.success("User has been registered")
    } else {
      const data: ErrorJSON = await response.json()
      toast.error(`Error: ${data.error}`)
    }
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong, sorry po(")
  }
}
