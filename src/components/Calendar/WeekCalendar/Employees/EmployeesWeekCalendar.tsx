import { getVacationsForPeriod } from "components/Calendar/EmployeeCalendar"
import { getTasksForPeriod } from "components/Calendar/OffersCalendar"
import moment from "moment"
import { FC, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { ITask, IVacation } from "types/calendar"
import EmployeeRow from "./EmployeeRow"
import styles from "./EmployeesWeekCalendar.module.scss"
import Header from "./Header/EmployeeWeekCalendarHeader"

type PropsType = {
  vacationForEmployeeId: string | null
  handleOpenVacationModal: (employeeId: string) => void
}

const EmployeesWeekCalendar: FC<PropsType> = ({
  vacationForEmployeeId,
  handleOpenVacationModal,
}) => {
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const emploees = useSelector(
    (state: RootStateType) => state.Table.tables.Employees
  )

  const startDay = moment(currentDate).startOf("week").format("YYYY-MM-DD")
  const dates = [...Array(7)].map((_, i) => moment(startDay).add(i, "days"))

  const [tasks, setTasks] = useState<ITask[]>([])
  const [vacations, setVacations] = useState<IVacation[]>([])

  useEffect(() => {
    getTasksForPeriod(currentDate, "week", setTasks)
    getVacationsForPeriod(currentDate, "week", setVacations)
  }, [currentDate, vacationForEmployeeId])

  useEffect(() => {
    if (vacationForEmployeeId !== null) return
    getTasksForPeriod(currentDate, "week", setTasks)
    getVacationsForPeriod(currentDate, "week", setVacations)
  }, [vacationForEmployeeId])

  const Employees = emploees.map((employee, i) => {
    const weekVacations = vacations?.filter(
      (v) =>
        +employee.id === v.employee.id &&
        dates.some((date) =>
          moment(date).isBetween(
            moment(v.start_date),
            moment(v.end_date).add(7, "day"),
            undefined,
            "[]"
          )
        )
    )

    return (
      <EmployeeRow
        key={i}
        dates={dates}
        employee={employee}
        weekTasks={tasks}
        weekVacations={weekVacations}
        handleOpenVacationModal={handleOpenVacationModal}
      />
    )
  })

  return (
    <div className={styles.wrapper}>
      <Header dates={dates} />
      <div className={styles.calendar}>{Employees}</div>
    </div>
  )
}

export default EmployeesWeekCalendar
