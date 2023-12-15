import moment from "moment"
import { FC } from "react"
import styles from "./EmployeesWeekCalendar.module.scss"
import defaultPhoto from "assets/images/person.svg"
import { IEmployee } from "types/tables"
import { serverDomain } from "services/API"
import { ITask, IVacation } from "types/calendar"
import { removeSeconds } from "utils/extractTaskTimePart"
import plusIcon from "assets/icons/plus.circle.svg"

type PropsType = {
  employee: IEmployee
  dates: moment.Moment[]
  weekTasks?: ITask[]
  weekVacations?: IVacation[]
  handleOpenVacationModal: (employeeId: string) => void
}

const dayStyles = {
  vacation: { background: "#9747FF" },
  task: { background: "#3375A5" },
  empty: {
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}

const EmployeeRow: FC<PropsType> = ({
  employee,
  dates,
  weekTasks,
  weekVacations,
  handleOpenVacationModal,
}) => {
  const Dates = dates.map((date, i) => {
    const dailyTask = weekTasks?.find(
      (t) =>
        t.courier?.employee.id === +employee?.id &&
        moment(t.date).isSame(date, "day")
    )
    const dailyVacation = weekVacations?.find((v) =>
      date.isBetween(moment(v.start_date), moment(v.end_date), undefined, "[]")
    )
    if (dailyVacation)
      return (
        <div key={i} className={styles.day} style={dayStyles.vacation}>
          <div>Urlaub</div>
          <div>Ganztägig</div>
        </div>
      )
    if (dailyTask)
      return (
        <div key={i} className={styles.day} style={dayStyles.task}>
          <div>
            {dailyTask.delivery?.delivery_number || dailyTask.contract?.firm}
          </div>
          <div>
            {removeSeconds(dailyTask.start_time)}-{removeSeconds(dailyTask.end_time)}
          </div>
        </div>
      )

    return (
      <div key={i} className={styles.day} style={dayStyles.empty}>
        Leer
      </div>
    )
  })

  return (
    <div className={styles.row}>
      <div
        className={styles.profile}
        onClick={() => handleOpenVacationModal(employee.id)}
      >
        <div className={styles.imageWrapper}>
          <img
            src={
              employee.image_path ? serverDomain + employee.image_path : defaultPhoto
            }
            alt="employee"
          />
					<img src={plusIcon} alt="plus" className={styles.plusIcon} />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>
            {employee.first_name} {employee.last_name}
          </div>
          <div className={styles.role}>{employee.role}</div>
        </div>
      </div>
      <div className={styles.days}>{Dates}</div>
    </div>
  )
}

export default EmployeeRow
