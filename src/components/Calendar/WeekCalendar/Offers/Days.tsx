import classNames from "classnames"
import { offerColors } from "components/Calendar/MonthCalendar/CalendarGrid/CalendarGrid"
import moment from "moment"
import { FC } from "react"
import { ITask } from "types/calendar"
import { IOffer } from "types/offers"
import { extractDate, removeSeconds } from "utils/extractTaskTimePart"
import { v1 } from "uuid"
import styles from "./OffersWeekCalendar.module.scss"
import defaultPhoto from "assets/images/person.svg"
import { IContract } from "types/tables"
import { workerTypeDictionary } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"
import truckIcon from "assets/icons/truck.svg"

const daysOfWeek = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
]

type PropsType = {
  currentDate: string
  tasks: ITask[]
  offers: IOffer[]
  contracts: IContract[]
  handleOpen: (taskId: number | null, type: "task" | "offer" | "contract") => void
}

const Days: FC<PropsType> = ({
  currentDate,
  tasks,
  offers,
  contracts,
  handleOpen,
}) => {
  const startDate = moment(currentDate).startOf("week")

  const Days = daysOfWeek.map((day) => {
    const date = moment(startDate).add(daysOfWeek.indexOf(day), "days")
    const dayTasks = tasks?.filter((task) => task.date === date.format("YYYY-MM-DD"))
    const dayOffers = offers?.filter(
      (offer) => offer.start_date === date.format("YYYY-MM-DD")
    )
    const dayContracts = contracts?.filter(
      (offer) => offer.date === date.format("YYYY-MM-DD")
    )

    const DayOffers = dayOffers?.map((o) => (
      <div
        key={v1()}
        className={styles.task}
        style={offerColors.ARRANGED}
        onClick={() => handleOpen(o.id, "offer")}
      >
        <div
          className={styles.number}
        >{`${o.customer.first_name} ${o.customer.last_name}`}</div>
      </div>
    ))
    const DayContracts = dayContracts.map((c) => (
      <div
        key={v1()}
        className={styles.task}
        onClick={() => handleOpen(c.id, "contract")}
      >
        <div className={styles.field}>{c.firm}</div>
      </div>
    ))

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
        <div key={v1()} className={styles.courier}>
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
          className={styles.task}
          style={
            offerColors[
              (task.delivery?.delivery_status as keyof typeof offerColors) ??
                (task.contract?.status as keyof typeof offerColors)
            ]
          }
        >
          <div className={classNames(styles.number, styles.taskHead)}>
            <div
              className={classNames(styles.status, task.contract && styles.contract)}
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
          <div>{`${removeSeconds(task.start_time)}-${removeSeconds(
            task.end_time
          )}`}</div>
          <div className={styles.couriers}>{couriers}</div>
          <div className={styles.couriers} style={{ marginTop: 6 }}>
            {trucks}
          </div>
        </div>
      )
    })

    return (
      <div key={v1()} className={styles.day}>
        <div className={classNames(styles.gridCell, styles.dayHeader)}>
          <div className={styles.date}>{date.format("DD")}</div>
          <div>{day}</div>
        </div>
        <div className={styles.tasks}>
          {DayOffers}
          {DayContracts}
          {DayTasks}
        </div>
      </div>
    )
  })
  return <>{Days}</>
}

export default Days
