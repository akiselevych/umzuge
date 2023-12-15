//libs
import { FC } from "react"
//styles
import styles from "./Select.module.scss"
//types
import { SelectProps } from "types/index"

const Select: FC<SelectProps> = ({ options, setCurrentOption, currentOption, label, disable }) => {
  return (
    <div className={`${styles.wrapper} ${disable ? styles.disable : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={styles.select} value={currentOption} onChange={(e) => setCurrentOption(+e.target.value)}>
        {options.map((item, i) => <option key={i} className={styles.wrapper} value={item.value}>{item.text}</option>)}
      </select>
    </div>
  )
}

export default Select