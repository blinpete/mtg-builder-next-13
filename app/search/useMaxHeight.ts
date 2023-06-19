import { RefObject, useEffect, useState } from "react"

export default function useMaxHeight({rootRef}: {
  rootRef: RefObject<HTMLElement>
}) {
  const [height, setHeight] = useState(100)

  useEffect(() => {
    const vpHeight = window.visualViewport?.height
    const rootOffset = rootRef.current?.offsetTop
    if (vpHeight && rootOffset) {
      setHeight(vpHeight - rootOffset)
    }
  }, [rootRef])

  return height
}