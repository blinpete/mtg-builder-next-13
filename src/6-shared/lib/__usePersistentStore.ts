import { useEffect, useState } from "react"

export function usePersistentStore<T>(props: { default: T; storageKey: string }) {
  // const [data, setData] = useState<Deck["cards"]>([])
  let cache: T | string | null = localStorage.getItem(props.storageKey)
  if (cache != null) cache = JSON.parse(cache) as T
  const [data, setData] = useState<T>(cache || props.default)

  useEffect(() => {
    const handler = () => {
      localStorage.setItem(props.storageKey, JSON.stringify(data))
    }
    window.addEventListener("beforeunload", handler)

    return () => {
      window.removeEventListener("beforeunload", handler)
    }
  }, [data, props.storageKey])

  return [data, setData] as const
}
