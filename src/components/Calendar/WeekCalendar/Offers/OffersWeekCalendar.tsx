import { CalendarPropsType } from "components/Calendar/OffersCalendar"
import ModalWindow from "components/ModalWindow/ModalWindow"
import OfferTaskOverview from "components/Overview/taskOverview/offerTaskOverview/OfferTaskOverview"
import moment from "moment"
import { FC, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { ITask } from "types/calendar"
import { IOffer } from "types/offers"
import styles from "./OffersWeekCalendar.module.scss"
import Notification from "components/Notification/Notification"
import Days from "./Days"
import { IContract } from "types/tables"
import ContractTaskOverview from "components/Overview/taskOverview/contractTaskOverview/ContractTaskOverview"

const OffersWeekCalendar: FC<CalendarPropsType> = ({
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null)
  const [currentOfferId, setCurrentOfferId] = useState<number | null>(null)
  const [currentContractId, setCurrentContractId] = useState<number | null>(null)
  const currentTask = tasks.find((t) => t.id === currentTaskId)
  const currentOffer = offers.find((o) => o.id === currentOfferId)
	const currentContract = contracts.find((c) => c.id === currentContractId)

  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)
  const [isAddNotificationVisible, setIsAddNotificationVisible] = useState(false)

  function refreshTasksOffers() {
    getOffers && getOffers(currentDate, "week", setOffers)
    getTasks && getTasks(currentDate, "week", setTasks)
    getContracts && getContracts(currentDate, "week", setContracts)
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

  return (
    <>
      <div className={styles.calendar}>
        <div className={styles.grid}>
          <Days
            currentDate={currentDate}
            tasks={tasks}
            offers={offers}
            contracts={contracts}
            handleOpen={handleOpen}
          />
        </div>
      </div>

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
            setIsAddNotificationVisible={setIsAddNotificationVisible}
            setIsEditNotificationVisible={setIsEditNotificationVisible}
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

export default OffersWeekCalendar
