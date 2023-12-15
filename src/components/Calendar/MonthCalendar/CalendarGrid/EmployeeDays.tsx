import moment from "moment"
import { FC, useMemo } from "react"
import { useSelector } from "react-redux"
import { serverDomain } from "services/API"
import { RootStateType } from "types"
import { ITask, IVacation } from "types/calendar"
import { ICourier, IEmployee } from "types/tables"
import { generateDaysArray } from "utils/generateDaysArray"
import { v1 } from "uuid"
import styles from "./CalendarGrid.module.scss"
import defaultPhoto from "assets/images/person.svg"
import { extractDate } from "utils/extractTaskTimePart"

type PropsType = {
  tasks: ITask[] | null
  couriers: ICourier[] | null
  employees: IEmployee[] | null
  vacations: IVacation[] | null
}

const borderColors = {
  hasTask: "#009F6A",
  vacation: "#07B7EE",
  sick: "#DA0F0F",
}

const EmployeeDays: FC<PropsType> = ({ tasks, couriers, employees, vacations }) => {
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const daysArray = useMemo(() => generateDaysArray(currentDate), [currentDate])

  const Days = daysArray.map((d) => {
    const VacationsForDay = vacations?.map((v) => {
      const employee = employees?.find((e) => +e.id === v.employee.id)

      if (employee && d.isBetween(v.start_date, v.end_date, undefined, "[]")) {
        return (
          <div key={v1()} className={styles.employee}>
            <div className={styles.tip}>
              {employee.first_name} {employee.last_name}
            </div>
            <img
              src={
                employee.image_path
                  ? serverDomain + employee.image_path
                  : defaultPhoto
              }
              style={{
                borderColor:
                  v.type === "sick" ? borderColors.sick : borderColors.vacation,
              }}
            />
          </div>
        )
      }
      return undefined
    })

    const CouriersWithTask = couriers?.map((c) => {
      const courierTasks = tasks?.filter((t) => t.courier?.id === c.id)
      const isTask = courierTasks?.some((t) => d.format("YYYY-MM-DD") === t.date)

      if (!isTask) return undefined
      return (
        <div key={c.id} className={styles.employee}>
          <div className={styles.tip}>
            {c.employee.first_name} {c.employee.last_name}
          </div>
          <img
            src={
              c.employee.image_path
                ? serverDomain + c.employee.image_path
                : defaultPhoto
            }
            style={{ borderColor: borderColors.hasTask }}
          />
        </div>
      )
    })

    return (
      <div key={v1()} className={styles.day}>
        <span
          className={
            !d.isSame(moment(), "month")
              ? styles.notCurrentMonth
              : d.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
              ? styles.today
              : ""
          }
        >
          {+d.format("D") === 1 ? d.format("D MMM.") : d.format("D")}
        </span>
        <div className={styles.employees}>
          {VacationsForDay}
          {CouriersWithTask}
        </div>
      </div>
    )
  })

  return <>{Days}</>
}

export default EmployeeDays
