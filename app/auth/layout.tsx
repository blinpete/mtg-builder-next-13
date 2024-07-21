import { ToasterContext } from "@shared/lib/ToasterContext"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ToasterContext />
      {children}
    </div>
  )
}
