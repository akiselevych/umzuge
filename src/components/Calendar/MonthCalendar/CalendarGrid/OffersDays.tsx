import moment from "moment"
import { FC, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { ITask } from "types/calendar"
import { IOffer } from "types/offers"
import { removeSeconds } from "utils/extractTaskTimePart"
import { generateDaysArray } from "utils/generateDaysArray"
import { v1 } from "uuid"
import { offerColors } from "./CalendarGrid"
import styles from "./CalendarGrid.module.scss"
import defaultPhoto from "assets/images/person.svg"
import { IContract } from "types/tables"
import classNames from "classnames"
import { workerTypeDictionary } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"
import truckIcon from "assets/icons/truck.svg"

type PropsType = {
  handleOpen: (taskId: number | null, type: "task" | "offer" | "contract") => void
  tasks: ITask[] | null
  offers: IOffer[]
  contracts: IContract[]
}

const OffersDays: FC<PropsType> = ({ handleOpen, tasks, offers, contracts }) => {
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )

  const daysArray = useMemo(() => generateDaysArray(currentDate), [currentDate])

  const Days = daysArray.map((d) => {
    const DayOffers = offers
      ?.filter((o) => o.start_date === d.format("YYYY-MM-DD"))
      .map((o) => (
        <div
          key={v1()}
          className={styles.offer}
          style={offerColors.ARRANGED}
          onClick={() => handleOpen(o.id, "offer")}
        >
          <div
            className={styles.field}
          >{`${o.customer.first_name} ${o.customer.last_name}`}</div>
        </div>
      ))
    const DayContracts = contracts
      ?.filter((c) => c.date === d.format("YYYY-MM-DD"))
      .map((c) => (
        <div
          key={v1()}
          className={styles.offer}
          onClick={() => handleOpen(c.id, "contract")}
        >
          <div className={styles.field}>{c.firm}</div>
        </div>
      ))

    const dayTasks = tasks?.filter((t) => t.date === d.format("YYYY-MM-DD"))
    const taskGroups: Record<string, ITask[]> = dayTasks?.reduce((groups, task) => {
      const deliveryNumber = task.delivery
        ? task.delivery.delivery_number
        : task.contract?.firm
      if (!groups[deliveryNumber!]) {
        groups[deliveryNumber!] = []
      }
      groups[deliveryNumber!].push(task)
      return groups
    }, {} as any)

    const DayTasks = Object.entries(taskGroups || {}).map(([_, tasksGroup]) => {
      const task = tasksGroup[0]
      const couriers = tasksGroup.map((t) => (
        <div
          key={v1()}
          className={styles.courier}
          onClick={() => handleOpen(t.id, "task")}
        >
          <div className={styles.tip}>
            <span>
              {t.courier
                ? `${t.courier?.employee.first_name} ${t.courier?.employee.last_name}`
                : t?.external_workers
                ? t.external_workers.first_name
                  ? `${t?.external_workers.first_name} ${t?.external_workers.last_name}`
                  : workerTypeDictionary[
                      t?.external_workers.type as keyof typeof workerTypeDictionary
                    ]
                : "Kein Kurier"}
            </span>
          </div>
          <img src={t.courier?.employee?.image || defaultPhoto} />
        </div>
      ))
      const trucks = task.car.map((c) => (
        <div
          key={v1()}
          className={styles.courier}
        >
          <div className={styles.tip}>
            <span>{c.name ? `${c.name} ${c?.number}` : c.type}</span>
          </div>
          <img src={truckIcon} />
        </div>
      ))

      const isMultiDay = task.delivery?.start_date !== task.delivery?.end_date
      let dayCount: number | null = isMultiDay
        ? moment(moment(task.date)).diff(task.delivery?.start_date, "days") + 1
        : 1

      if (dayCount > 9) {
        dayCount = null
      }

      return (
        <div
          key={v1()}
          className={styles.offer}
          style={
            offerColors[
              (task.delivery?.delivery_status as keyof typeof offerColors) ??
                (task.contract?.status as keyof typeof offerColors)
            ]
          }
        >
          <div className={classNames(styles.field, styles.taskHead)}>
            <div
              className={classNames(styles.status, task.contract && styles.contract)}
              style={isMultiDay && dayCount ? { maxWidth: "66%" } : {}}
            >
              {task.delivery
                ? `${task.delivery.customer.first_name} ${task.delivery.customer.last_name}`
                : task.contract?.firm}
            </div>
            {task.contract && <div className={styles.contractMark}>V</div>}
            {isMultiDay && dayCount && (
              <div className={styles.dayCount}>{`Tag ${dayCount}`}</div>
            )}
          </div>
          <div className={styles.field}>
            {removeSeconds(task.start_time)}-{removeSeconds(task.end_time)}
          </div>
          <div className={styles.couriers}>{couriers}</div>
          <div className={styles.couriers} style={{marginTop: 6}}>{trucks}</div>
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
        <div className={styles.offers}>
          {DayOffers}
          {DayContracts}
          {DayTasks}
        </div>
      </div>
    )
  })

  return <>{Days}</>
}

export default OffersDays
