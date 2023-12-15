import { FC, useEffect, useState } from "react"
import styles from "./CalendarGrid.module.scss"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import ModalWindow from "components/ModalWindow/ModalWindow"
import OfferTaskOverview from "components/Overview/taskOverview/offerTaskOverview/OfferTaskOverview"
import OffersDays from "./OffersDays"
import EmployeeDays from "./EmployeeDays"
import { IOffer } from "types/offers"
import { CalendarPropsType } from "components/Calendar/OffersCalendar"
import { ITask, IVacation } from "types/calendar"
import Notification from "components/Notification/Notification"
import { IContract } from "types/tables"
import ContractTaskOverview from "components/Overview/taskOverview/contractTaskOverview/ContractTaskOverview"
import { getVacationsForPeriod } from "components/Calendar/EmployeeCalendar"

export const offerColors = {
  ARRANGED: { borderColor: "#2196F3" }, // Blue
  ASSIGNED: { borderColor: "#FF9800" }, // Orange
  STARTED: { borderColor: "#09f51d" }, // Deep Orange
  FINISHED: { borderColor: "#049e44" }, // Dark Green
  POSTPONED: { borderColor: "#e62315" }, // Red
  CANCELLED: { borderColor: "#d81b0d" }, // Red
}

const CalendarGrid: FC<CalendarPropsType> = ({
  getOffers,
  getTasks,
  getContracts,
}) => {
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const [tasks, setTasks] = useState<ITask[]>([])
  const [offers, setOffers] = useState<IOffer[]>([])
  const [contracts, setContracts] = useState<IContract[]>([])
  const [vacations, setVacations] = useState<IVacation[]>([])

  const couriers = useSelector((state: RootStateType) => state.Table.couriers)
  const employees = useSelector(
    (state: RootStateType) => state.Table.tables.Employees
  )

  const calendarItem = useSelector(
    (state: RootStateType) => state.Calendar.calendarItem
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null)
  const [currentOfferId, setCurrentOfferId] = useState<number | null>(null)
  const [currentContractId, setCurrentContractId] = useState<number | null>(null)
  const currentTask = tasks?.find((t) => t.id === currentTaskId)
  const currentOffer = offers?.find((o) => o.id === currentOfferId)
  const currentContract = contracts?.find((c) => c.id === currentContractId)

  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)
  const [isAddNotificationVisible, setIsAddNotificationVisible] = useState(false)

  function refreshTasksOffers() {
    if (getOffers && getTasks && getContracts) {
      getOffers(currentDate, "month", setOffers)
      getTasks(currentDate, "month", setTasks)
      getContracts(currentDate, "month", setContracts)
    } else if (getTasks) {
      getTasks(currentDate, "month", setTasks)
      getVacationsForPeriod(currentDate, "month", setVacations)
    }
  }

  useEffect(() => {
    refreshTasksOffers()
  }, [currentDate])

  function handleOpen(id: number | null, type: "task" | "offer" | "contract") {
    setCurrentTaskId(null)
    setCurrentOfferId(null)
    setCurrentContractId(null)
    switch (type) {
      case "task": {
        setCurrentTaskId(id)
        break
      }
      case "offer": {
        setCurrentOfferId(id)
        break
      }
      case "contract": {
        setCurrentContractId(id)
        break
      }
    }
    setIsModalOpen(true)
  }

  const Days =
    calendarItem === "Angebote" ? (
      <OffersDays
        tasks={tasks}
        offers={offers}
        contracts={contracts}
        handleOpen={handleOpen}
      />
    ) : (
      <EmployeeDays
        tasks={tasks}
        couriers={couriers}
        employees={employees}
        vacations={vacations}
      />
    )

  return (
    <>
      <div className={styles.calendar}>{Days}</div>

      <ModalWindow
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
        size="small"
        withLogo={true}
      >
        {currentTask?.delivery || currentOffer ? (
          <OfferTaskOverview
            task={currentTask}
            offer={currentOffer}
            setIsModalOpen={setIsModalOpen}
            refreshTasksOffers={refreshTasksOffers}
            setIsEditNotificationVisible={setIsEditNotificationVisible}
            setIsAddNotificationVisible={setIsAddNotificationVisible}
          />
        ) : (
          <ContractTaskOverview
            task={currentTask}
            contract={currentContract}
            setIsModalOpen={setIsModalOpen}
            refreshTasksOffers={refreshTasksOffers}
            setIsEditNotificationVisible={setIsEditNotificationVisible}
            setIsAddNotificationVisible={setIsAddNotificationVisible}
          />
        )}
      </ModalWindow>

      <div className={styles.notification}>
        <Notification
          text="Aufgabe wurde geändert!"
          isVisible={isEditNotificationVisible}
          setIsvisible={setIsEditNotificationVisible}
        />
      </div>
      <div className={styles.notification}>
        <Notification
          text="Aufgabe wurde hinzugefügt!"
          isVisible={isAddNotificationVisible}
          setIsvisible={setIsAddNotificationVisible}
        />
      </div>
    </>
  )
}

export default CalendarGrid
