import { FC } from "react"
import classNames from "classnames"
import styles from "components/TablesList/TablesList.module.scss"

type PropsType<T extends string> = {
  categoriesDict: Record<T, string>
  currentCategory: T
  setCurrentCategory: (category: T) => void
}

const CategoriesList = <T extends string>(props: PropsType<T>) => {
  const { categoriesDict, currentCategory, setCurrentCategory } = props

  const CategoriesList = Object.keys(categoriesDict).map((n, i) => (
    <div
      key={i}
      className={
        n === currentCategory
          ? classNames(styles.tableName, styles.current)
          : styles.tableName
      }
      onClick={() => setCurrentCategory(n as T)}
    >
      {categoriesDict[n as keyof typeof categoriesDict]}
    </div>
  ))
  return <div className={styles.tableList}>{CategoriesList}</div>
}

export default CategoriesList
