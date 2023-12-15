import { useEffect, useState } from "react"

type PropstType<T extends string> = {
  category: T
  categoryActions: Record<T, () => void>
}

export const useTableCategoryEffect = <T extends string>(props: PropstType<T>) => {
  const { category, categoryActions } = props

  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    const action = categoryActions[category]
    action()
  }, [category])
}
