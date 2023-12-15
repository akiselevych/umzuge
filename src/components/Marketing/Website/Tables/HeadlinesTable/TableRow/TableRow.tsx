import styles from "./index.module.scss"
//libs
import { useState, FC, useEffect, useRef } from "react"
import { useDebounce } from "hooks/useDebounce"
//rerdux
import { useSelector } from "react-redux"
//types
import { RootStateType } from "types/index"

type Props = {
  data: [string, string],
  onUpdate: (arg: [string, string]) => void
}


const TableRow: FC<Props> = ({ data, onUpdate }) => {
  const [inputValue, setInputValue] = useState(data[1])
  const debauncedInputValue = useDebounce(inputValue, 500)
  const inputsChangesCounter = useRef(0)
  const currentPageName = useSelector((state: RootStateType) => state.marketingWebPage.currentPageName)

  useEffect(() => {
    setInputValue(data[1])
    inputsChangesCounter.current = 0
    //eslint-disable-next-line
  }, [currentPageName])

  useEffect(() => {
    if (inputsChangesCounter.current) {
      onUpdate([data[0], debauncedInputValue])
    }
    //eslint-disable-next-line
  }, [debauncedInputValue])



  return (
    <li className={styles.row}>
      <div className={styles.cell}>
        {data[0].slice(0, 2).toUpperCase()}
      </div>
      <div className={styles.cell}>
        {data[0].slice(4)}
      </div>
      <div className={styles.cell}>
        <textarea value={inputValue} onChange={e => {
          setInputValue(e.target.value)
          inputsChangesCounter.current++
        }} />
      </div>

    </li>
  )
}

export default TableRow