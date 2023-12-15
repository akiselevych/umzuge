import { FC } from "react"
import styles from "../../CellDetailsContent.module.scss"
import { ITask } from "types/calendar"
import WorkingTimeGroups from "./WorkingTimeGroups"

type PropsType = {
  groupedTasks: Record<string, ITask[]>
}

const WorkingTimeBlock: FC<PropsType> = ({ groupedTasks }) => {
  const taskDates = Object.keys(groupedTasks)

  const GroupsByDayComponents = taskDates.map((date, i) => (
    <WorkingTimeGroups
      key={i}
      dayNumber={i + 1}
      tasks={groupedTasks[date]}
      isSingleDay={taskDates.length === 1}
    />
  ))

	if(taskDates.length === 0) return <></>

  return (
    <div className={styles.workingTime}>
      <h2 className={styles.subtitle}>Arbeitszeiten</h2>
      {GroupsByDayComponents}
    </div>
  )
}

export default WorkingTimeBlock
