"use client"
import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}
