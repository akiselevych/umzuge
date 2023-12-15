import { FC } from "react"
import styles from "./WorkersPricesTable.module.scss"
import { handleNumberInputChange } from "utils/handelNumberInputChange"

type PropsType = {
  value: number
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const InputCell: FC<PropsType> = (props) => {
  const { value, handleChange, disabled } = props

  return (
    <div className={styles.cell}>
      <input
        type="text"
        onKeyDown={handleNumberInputChange}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}

export default InputCell
