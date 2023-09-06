import { useEffect } from "react"

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} | Rule Your Games`

    return () => {
      document.title = prevTitle
    }
  }, [])
}