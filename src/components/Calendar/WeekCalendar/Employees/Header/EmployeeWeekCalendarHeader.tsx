import classNames from "classnames"
import moment from "moment"
import { FC } from "react"
import styles from "./EmployeeWeekCalendarHeader.module.scss"

const EmployeeWeekCalendarHeader: FC<{
  dates: moment.Moment[]
}> = ({ dates }) => {
  const daysNames = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."]

  const Dates = dates.map((d, i) => (
    <div key={i} className={styles.cell}>
      <div
        className={classNames(
          styles.date,
          d.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") && styles.today
        )}
      >
        {d.format("DD.M")}
      </div>
      <div
        className={
          d.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
            ? styles.today
            : ""
        }
      >
        {daysNames[i]}
      </div>
    </div>
  ))

  return (
    <div className={styles.header}>
      <div></div>
      <div className={styles.content}>{Dates}</div>
    </div>
  )
}

export default EmployeeWeekCalendarHeader
