import { FC } from "react"
import styles from "./DaysNames.module.scss"

const DaysNames: FC = () => {
  const daysNamesData = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."]
  const DaysNames = daysNamesData.map((d, i) => (
    <div key={i} className={styles.dayName}>
      {d}
    </div>
  ))

  return <div className={styles.daysNames}>{DaysNames}</div>
}

export default DaysNames
