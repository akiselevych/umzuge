import ModalWindow from "components/ModalWindow/ModalWindow"
import OfferOverview from "components/Overview/offerOverview/OfferOverview"
import moment from "moment"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { IOffer } from "types/offers"
import styles from "./CalendarTable.module.scss"
import CourierCell from "./CourierCell/CourierCell"
import SaleManCell from "components/Calendar/DayCalendar/EmployeeDayCalendar/SaleManCell/SaleManCell"
import classNames from "classnames"
import { getQueryString } from "utils/getQueryString"
import { API } from "services/API"
import { ITask, IVacation } from "types/calendar"

type PropsType = {
  handleOpenVacationModal: (employeeId: string) => void
}

async function getDayTasks(
  currentDate: string,
  setTasks: Dispatch<SetStateAction<ITask[] | null>>
) {
  const filters = {
    date_after: currentDate,
    date_before: currentDate,
  }
  const response = await API.getTasks(getQueryString(filters))
  setTasks(response.results)
}
export async function getDayVacations(
  currentDate: string,
  setVacations: Dispatch<SetStateAction<IVacation[] | null>>
) {
  const filters = {
    start_date_before: currentDate,
    end_date_after: currentDate,
  }
  const response = await API.getVacations(getQueryString(filters))
  setVacations(response.results)
}

const CalendarTable: FC<PropsType> = ({ handleOpenVacationModal }) => {
  const [tasks, setTasks] = useState<ITask[] | null>(null)
  const [vacations, setVacations] = useState<IVacation[] | null>(null)
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const couriers = useSelector((state: RootStateType) => state.Table.couriers)
  const saleMans = useSelector(
    (state: RootStateType) => state.Table.tables.Employees
  ).filter((e) => e.role === "sale_man")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<IOffer | undefined>()
  const [isCouriers, setIsCouriers] = useState<boolean>(true)

  useEffect(() => {
    getDayTasks(currentDate, setTasks)
    getDayVacations(currentDate, setVacations)

		if(!isModalOpen) {
			setCurrentOffer(undefined)
		}
  }, [currentDate, isModalOpen])

  if (!tasks || !couriers || !vacations) return <div>Laden...</div>

  const currentDay = moment(currentDate)

  const Couriers = couriers
    .map((c) => {
      const tasksForCourier = tasks.filter((t) => t.courier?.id === c.id)
      return {
        ...c,
        tasksForCourier,
      }
    })
    .sort((a, b) => {
      const lengthDifference = a.tasksForCourier.length - b.tasksForCourier.length
      if (lengthDifference !== 0) return lengthDifference
      const aHasVacation = vacations?.some((v) => v.employee.id === +a.employee.id)
      const bHasVacation = vacations?.some((v) => v.employee.id === +b.employee.id)
      if (aHasVacation && !bHasVacation) return 1
      if (bHasVacation && !aHasVacation) return -1
      return 0
    })
    .map((c) => {
      const isVacation = vacations?.some((v) => v.employee.id === +c.employee.id)
      return (
        <CourierCell
          key={c.id}
          courier={c}
          currentDay={currentDay}
          dailyTasks={c.tasksForCourier}
          handleTaskClick={handleTaskClick}
          handleOpenVacationModal={handleOpenVacationModal}
          isVacation={isVacation}
        />
      )
    })

  const SaleMans = saleMans
    .sort((a, b) => {
      const aHasVacation = vacations?.some((v) => v.employee.id === +a.id)
      const bHasVacation = vacations?.some((v) => v.employee.id === +b.id)
      if (aHasVacation && !bHasVacation) return 1
      if (bHasVacation && !aHasVacation) return -1
      return 0
    })
    .map((s) => {
      const isVacation = vacations?.some((v) => v.employee.id === +s.id)

      return (
        <div className={styles.employeeContainer} key={s.id}>
          <SaleManCell
            saleMan={s}
            isVacation={isVacation}
            handleOpenVacationModal={handleOpenVacationModal}
          />
        </div>
      )
    })

  function handleTaskClick(offer: IOffer | null) {
    if (offer) {
      setCurrentOffer(offer)
			setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className={styles.calendar}>
        <div className={styles.switchers}>
          <div
            className={
              isCouriers
                ? classNames(styles.switch, styles.switchActive)
                : styles.switch
            }
            onClick={() => setIsCouriers((prevState) => !prevState)}
          >
            Kurier
          </div>
          <div
            className={
              !isCouriers
                ? classNames(styles.switch, styles.switchActive)
                : styles.switch
            }
            onClick={() => setIsCouriers((prevState) => !prevState)}
          >
            Verkäufer
          </div>
        </div>

        {isCouriers ? Couriers : SaleMans}
      </div>
      <ModalWindow
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
        withLogo={false}
				removeCloseButton
        size="small"
      >
        <OfferOverview setIsModalOpen={setIsModalOpen} offer={currentOffer} />
      </ModalWindow>
    </>
  )
}

export default CalendarTable
