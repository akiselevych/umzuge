//libs
import { FC } from "react"
//styles
import styles from "./ToggleSwitcher.module.scss"
//types
import { ToggleSwitcherProps } from "types/index"

const ToggleSwitcher: FC<ToggleSwitcherProps> = ({
  value1,
  value2,
  value3,
  activeValue,
  setActiveValue,
}) => {
  return (
    <div className={styles.wrapper}>
      <p
        onClick={() => setActiveValue(value1)}
        className={`${styles.item} ${activeValue === value1 ? styles.active : ""}`}
      >
        {value1}
      </p>
      <p
        onClick={() => setActiveValue(value2)}
        className={`${styles.item} ${activeValue === value2 ? styles.active : ""}`}
      >
        {value2}
      </p>
      {value3 &&
        <p
          onClick={() => setActiveValue(value3)}
          className={`${styles.item} ${activeValue === value3 ? styles.active : ""}`}
        >
          {value3}
        </p>}
    </div>
  )
}

export default ToggleSwitcher
