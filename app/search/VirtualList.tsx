"use client"

import type Scry from 'scryfall-sdk';
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';
import { useEffect, useRef, useState } from 'react';
 
// function Row({ index, style }: ListChildComponentProps) {
//   return <div style={style}>Row {index}</div>
// }
 
export function VirtualList({itemsLength, rowFn}: {
  itemsLength,
  rowFn: (props: ListChildComponentProps) => JSX.Element
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


  return (
    <List
      outerRef={rootRef}
      className="border-2 border-red-400"
      height={height}
      itemCount={itemsLength}
      itemSize={35}
      width="100%"
    >
      {rowFn}
    </List>
  )
}
