"use client"

import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';
import { useEffect, useRef, useState } from 'react';
 
export function VirtualList({
  itemsLength, rowFn,
  onReachBottom, isFetching, hasNext
}: {
  itemsLength: number
  rowFn: (props: ListChildComponentProps) => JSX.Element
  onReachBottom: () => void
  isFetching: boolean
  hasNext?: boolean
}) {
  const rootRef = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(100)

  useEffect(() => {
    const vpHeight = window.visualViewport?.height
    const rootOffset = rootRef.current?.offsetTop
    if (vpHeight && rootOffset) {
      setHeight(vpHeight - rootOffset)
    }
  }, [])

  // const handleReachBottom = experimental_useEffectEvent(() => onReachBottom())

  useEffect(() => {
    if (!hasNext) return

    const root = rootRef.current
    const id = 'vlist-bottom'
    
    const el = document.createElement('div')
    el.id = id
    el.className = 'border-2 border-green-400 flex justify-center'
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
  }, [onReachBottom, isFetching, hasNext])


  return (
    <List
      outerRef={rootRef}
      height={height}
      itemCount={itemsLength}
      itemSize={320+24}
      width="100%"
      overscanCount={4}
    >
      {rowFn}
    </List>
  )
}
