import { Dispatch, FC, SetStateAction, useState } from "react"
import moment from "moment"
import MonthCalendarGrid from "./MonthCalendar/CalendarGrid/CalendarGrid"
import CalendarHeader from "./CalendarHeader/CalendarHeader"
import DaysNames from "./MonthCalendar/DaysNames/DaysNames"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import CalendarTable from "./DayCalendar/EmployeeDayCalendar/CalendarTable"
import styles from "./Calendar.module.scss"
import EmployeesWeekCalendar from "./WeekCalendar/Employees/EmployeesWeekCalendar"
import { getTasksForPeriod } from "./OffersCalendar"
import ModalWindow from "components/ModalWindow/ModalWindow"
import DispositionVacation from "components/DispositionVacation/DispositionVacation"
import Notification from "components/Notification/Notification"
import { IVacation } from "types/calendar"
import { API, instance } from "services/API"
import { getQueryString } from "utils/getQueryString"

const EmployeeCalendar: FC = () => {
  moment.updateLocale("en", { week: { dow: 1 } })

  const calendarViewMode = useSelector(
    (state: RootStateType) => state.Calendar.calendarViewMode
  )

  const [isAddingVacation, setIsAddingVacation] = useState(false)
  const [vacationForEmployeeId, setVacationForEmployeeId] = useState<string | null>(
    null
  )
  const [isVacationNotification, setIsVacationNotification] = useState(false)

  function handleOpenVacationModal(employeeId: string) {
    setVacationForEmployeeId(employeeId)
    setIsAddingVacation(true)
  }

  let displayCalendar = null
  switch (calendarViewMode) {
    case "Tag": {
      displayCalendar = (
        <CalendarTable handleOpenVacationModal={handleOpenVacationModal} />
      )
      break
    }
    case "Woche": {
      displayCalendar = (
        <EmployeesWeekCalendar
          vacationForEmployeeId={vacationForEmployeeId}
          handleOpenVacationModal={handleOpenVacationModal}
        />
      )
      break
    }
    case "Monat": {
      displayCalendar = (
        <div>
          <DaysNames />
          <MonthCalendarGrid getTasks={getTasksForPeriod} />
        </div>
      )
      break
    }
  }

  return (
    <>
      <div className={styles.calendar}>
        <CalendarHeader />
        {displayCalendar}
      </div>

      <div className={styles.notification}>
        <Notification
          text="Urlaub wurde erstellt!"
          isVisible={isVacationNotification}
          setIsvisible={setIsVacationNotification}
        />
      </div>

      <ModalWindow
        isModaltOpen={isAddingVacation}
        setIsModaltOpen={setIsAddingVacation}
        size="tiny"
        withLogo
      >
        <DispositionVacation
          employeeId={vacationForEmployeeId!}
          setIsVacationNotification={setIsVacationNotification}
          setIsOpen={setIsAddingVacation}
          setVacationForEmployeeId={setVacationForEmployeeId}
        />
      </ModalWindow>
    </>
  )
}

export default EmployeeCalendar

export async function getVacationsForPeriod(
  currentDate: string,
  period: "week" | "month",
  setTasks: Dispatch<SetStateAction<IVacation[]>>
) {
  const filters = {
    start_date_after: moment(currentDate)
      .startOf(period === "month" ? "month" : "week")
      .startOf("week")
      .format("YYYY-MM-DD"),
    start_date_before: moment(currentDate)
      .endOf(period)
      .add(15, "day")
      .format("YYYY-MM-DD"),
  }
  let response = await API.getVacations(getQueryString(filters))
  setTasks(response.results)
  while (response.next) {
    const nextPageResponse = await instance.get(response.next.split(".info")[1])
    setTasks((prev) => [...prev, ...nextPageResponse.data.results])
    response = nextPageResponse
  }
}
