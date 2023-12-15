import { FC, useEffect, useState } from "react"
import styles from "./DispositionWorkflow.module.scss"
import EmployeeCalendar from "components/Calendar/EmployeeCalendar"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import InternalWorkers from "components/DispositionWorkers/InternalWorkers"
import ExternalWorkers from "components/DispositionWorkers/ExternalWorkers"
import classNames from "classnames"
import Notification from "components/Notification/Notification"
import ModalWindow from "components/ModalWindow/ModalWindow"
import SaleManInfo from "components/SaleManInfo/SaleManInfo"
import OffersCalendar from "components/Calendar/OffersCalendar"
import {
  getCars,
  getCouriers,
  getEmployees,
  getOffers,
} from "reduxFolder/slices/Table.slice"
import { getTasks, getVacations } from "reduxFolder/slices/Calendar.slice"
import { useActions } from "hooks/useActions"
import moment from "moment"
import Companies from "components/Companies/Companies"

const DispositionWorkflow: FC = () => {
  const currentScreen = useSelector(
    (state: RootStateType) => state.Calendar.currentScreen
  )
  const calendarItem = useSelector(
    (state: RootStateType) => state.Calendar.calendarItem
  )
  const calendarViewMode = useSelector(
    (state: RootStateType) => state.Calendar.calendarViewMode
  )
  const currentSalemanId = useSelector(
    (state: RootStateType) => state.Calendar.currentlyOpenedSaleManId
  )

  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const { setCurrentDate, setCurrentlyOpenedSaleManId, setCurrentlyOpenedSaleMan } =
    useActions()

  useEffect(() => {
		
    setCurrentlyOpenedSaleManId(null)
    setCurrentlyOpenedSaleMan(null)
  }, [isModalOpen])

  useEffect(() => {
    if (!isFirstRender) {
      setCurrentDate(moment().format("YYYY-MM-DD"))
    }

    if (calendarItem === "Mitarbeiter") {
      dispatch(getEmployees())
      dispatch(getVacations())
    } else {
      dispatch(getOffers())
      dispatch(getCars())
    }
    dispatch(getTasks())
    dispatch(getCouriers())
  }, [calendarViewMode, calendarItem])

  useEffect(() => {
    if (!isFirstRender) {
      setIsModalOpen(true)
    }
    setIsFirstRender(false)
  }, [currentSalemanId])

  let displayItem = null
  switch (currentScreen) {
    case "Calendar": {
      switch (calendarItem) {
        case "Angebote": {
          displayItem = <OffersCalendar />
          break
        }
        case "Mitarbeiter": {
          displayItem = <EmployeeCalendar />
          break
        }
      }
      break
    }
    case "Internal workers": {
      displayItem = (
        <InternalWorkers setIsNotifivationVisible={setIsNotifivationVisible} />
      )
      break
    }
    case "Suppliers": {
      displayItem = <Companies />
      break
    }
  }

  return (
    <>
      <div className={styles.dispositionWorkflow}>
        <main>{displayItem}</main>
      </div>

      <div className={styles.notification}>
        <Notification
          text="Die Nachricht wurde gesendet!"
          isVisible={isNotifivationVisible}
          setIsvisible={setIsNotifivationVisible}
        />
      </div>

      <ModalWindow
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
        size="large"
        withLogo
      >
        <SaleManInfo saleManId={currentSalemanId as string} />
      </ModalWindow>
    </>
  )
}

export default DispositionWorkflow
