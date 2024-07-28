import { ToasterContext } from "@shared/lib/ToasterContext"
import { LayoutMain } from "@widgets/LayoutMain"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutMain>
      <ToasterContext />
      {children}
    </LayoutMain>
  )
}
