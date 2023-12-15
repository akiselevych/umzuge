import { FC } from "react"
import styles from "../../CellDetailsContent.module.scss"
import { ITask } from "types/calendar"
import WorkingTimeWorker from "./WorkingTimeWorker"

type PropsType = {
  dayNumber: number
  tasks: ITask[]
	isSingleDay: boolean
}

const WorkingTimeGroups: FC<PropsType> = ({ dayNumber, tasks, isSingleDay }) => {
  const internalTasks = tasks.filter((task) => !!task.courier)
  const externalTasks = tasks.filter((task) => !task.courier)
  const InternalWorkersComponents = internalTasks.map((task, i) => {
    const name = `${task.courier.employee.first_name} ${task.courier.employee.last_name}`

    return (
      <WorkingTimeWorker
        key={i}
        name={name}
        start_time={task.start_time}
        end_time={task.end_time}
      />
    )
  })

  const ExternalWorkersComponents = externalTasks.map((task, i) => {
    const name = task.external_workers?.first_name
      ? `${task.external_workers?.first_name} ${task.external_workers?.last_name}`
      : task.external_workers?.type

    return (
      <WorkingTimeWorker
        key={i}
        name={name || "externer Mitarbeiter"}
        start_time={task.start_time}
        end_time={task.end_time}
      />
    )
  })

  if (tasks.length === 0) return <></>

  return (
    <>
      {!isSingleDay && <div className={styles.columnTitle}>Tag {dayNumber}</div>}
      <div className={styles.workers}>
        <div className={styles.group}>
          <h2 className={styles.columnTitle}>Interne</h2>
          {InternalWorkersComponents}
        </div>
        <div className={styles.group}>
          <h2 className={styles.columnTitle}>Externe</h2>
          {ExternalWorkersComponents}
        </div>
      </div>
    </>
  )
}

export default WorkingTimeGroups
