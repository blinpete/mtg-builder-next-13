import { useCallback, useEffect, useRef } from "react"

export function useEffectEventCustom<T extends (...args: unknown[]) => unknown>(callback: T) {
  const fn = useRef(callback)

  useEffect(() => {
    fn.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => fn.current(...args) as ReturnType<T>, [])
}
