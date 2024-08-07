import { LayoutMain } from "@widgets/LayoutMain"
import { ToasterContext } from "@shared/lib/ToasterContext"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutMain>
      <ToasterContext />
      {children}
    </LayoutMain>
  )
}
