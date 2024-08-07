import { useSession } from "next-auth/react"

import type { PropsWithChildren } from "react"

export function AuthGuard({ children }: PropsWithChildren) {
  const { status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return children
}
