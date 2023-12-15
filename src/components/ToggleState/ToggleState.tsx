import classNames from "classnames"
import { useActions } from "hooks/useActions"
import moment from "moment"
import { FC } from "react"
import styles from "./ToggleState.module.scss"

const ToggleState: FC<{
  options: string[]
  currentOption: string
  onToggle: (value: any) => void
  refreshDate?: boolean
}> = ({ options, onToggle, currentOption, refreshDate }) => {
  const { setCurrentDate } = useActions()

  function handleClick(option: any) {
    if (refreshDate) {
      setCurrentDate(moment().format("YYYY-MM-DD"))
    }
    onToggle(option)
  }

  const Options = options.map((option, i) => (
    <div
      key={i}
      className={
        currentOption === option
          ? classNames(styles.option, styles.active)
          : styles.option
      }
      onClick={() => handleClick(option)}
    >
      {option}
    </div>
  ))

  return <div className={styles.main}>{Options}</div>
}

export default ToggleState
