"use client"

import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';
import { useRef } from 'react';
import useMaxHeight from './useMaxHeight';
import useBottomLoader from './useBottomLoader';
 
export function VirtualList({
  itemsLength, rowFn,
  onReachBottom, isFetching, hasNext
}: {
  itemsLength: number
  rowFn: (props: ListChildComponentProps) => JSX.Element
} & Parameters<typeof useBottomLoader>[0]) {
  const rootRef = useRef<HTMLElement>(null)

  const height = useMaxHeight({rootRef})

  useBottomLoader({rootRef, onReachBottom, hasNext, isFetching})

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
