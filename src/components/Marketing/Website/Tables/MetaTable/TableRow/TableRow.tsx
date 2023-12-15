import styles from "./index.module.scss"
//libs
import { useState, FC, useEffect, useRef } from "react"
import { useDebounce } from "hooks/useDebounce"
//rerdux
import { useSelector } from "react-redux"
import { RootStateType } from "types/index"
type Props = {
  onUpdate: (string: string, keyName: "meta_description" | "meta_title") => void
  value: string;
  keyName: "meta_description" | "meta_title";
}


const TableRow: FC<Props> = ({ onUpdate, value, keyName }) => {
  const [inputValue, setInputValue] = useState(value)
  const debauncedInputValue = useDebounce(inputValue, 500)
  const mountCounter = useRef(0)
  const currentPageName = useSelector((state: RootStateType) => state.marketingWebPage.currentPageName)

  useEffect(() => {
    setInputValue(value)
    mountCounter.current = 0
    //eslint-disable-next-line
  }, [currentPageName])

  useEffect(() => {
    if (mountCounter.current) {
      onUpdate(debauncedInputValue, keyName)
    }
    //eslint-disable-next-line
  }, [debauncedInputValue])


  useEffect(() => {
    mountCounter.current++
  })


  return (
    <li className={styles.row}>
      <div className={styles.cell}>
        {keyName}
      </div>
      <div className={styles.cell}>
        <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} />
      </div>
      <div className={styles.cell}>
        {inputValue.trim().split(" ").length}
      </div>
    </li>
  )
}

export default TableRow