"use client"
import { useSession } from "next-auth/react"
import React from "react"

export const User = () => {
  const { data: session } = useSession()
  // return <div>{JSON.stringify(session)}</div>
  return <div>{session?.user?.name}</div>
}
