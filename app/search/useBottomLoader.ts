import { RefObject, useEffect } from "react"

export default function useBottomLoader({rootRef, onReachBottom, hasNext, isFetching}: {
  rootRef: RefObject<HTMLElement>
  hasNext?: boolean
  isFetching: boolean
  onReachBottom: () => void
}) {
  // const handleReachBottom = experimental_useEffectEvent(() => onReachBottom())

  useEffect(() => {
    if (!hasNext) return

    const root = rootRef.current
    const id = 'vlist-bottom'
    
    const el = document.createElement('div')
    el.id = id
    el.className = 'flex justify-center'
    el.innerText = 'Loading more...'

    root?.appendChild(el)
    
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]) return
      
      console.log("🚀 | io | entries[0]:", entries[0])
      if (entries[0].intersectionRatio > 0 && !isFetching) {
        onReachBottom()
      }
    })
    observer.observe(el)

    
    return () => {
      const el = root?.querySelector('#'+id)
      if (el) observer.unobserve(el)
      observer.disconnect()

      if (el) root?.removeChild(el)
    }
  }, [onReachBottom, isFetching, hasNext, rootRef])


}