"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchInput(props: {
  renderer: JSX.Element
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  console.log("🚀 | SearchInput | searchParams:", searchParams)

  const order = searchParams.get('order')
  const direction = searchParams.get('dir')
  const query = searchParams.get('q')
  
  return (
    <>
      {query
        ? props.renderer
        : <div>Query is empty</div>
      }
    </>
  )
}