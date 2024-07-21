import { useCallback, useEffect, useRef } from "react"

export function useEffectEventCustom<T extends (...args: any[]) => any>(callback: T) {
  const fn = useRef(callback)

  useEffect(() => {
    fn.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => fn.current(...args) as ReturnType<T>, [])
}
