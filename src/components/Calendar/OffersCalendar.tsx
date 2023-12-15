import moment from "moment"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import styles from "./Calendar.module.scss"
import CalendarHeader from "./CalendarHeader/CalendarHeader"
import MonthCalendarGrid from "./MonthCalendar/CalendarGrid/CalendarGrid"
import DaysNames from "./MonthCalendar/DaysNames/DaysNames"
import OffersDayCalendar from "./DayCalendar/OffersDayCalendar/OffersDayCalendar"
import OffersWeekCalendar from "./WeekCalendar/Offers/OffersWeekCalendar"
import { IOffer } from "types/offers"
import { getQueryString } from "utils/getQueryString"
import { API, instance } from "services/API"
import { ITask } from "types/calendar"
import { IContract } from "types/tables"

export type CalendarPropsType = {
  getOffers?: (
    currentDate: string,
    period: "week" | "month",
    setOffers: Dispatch<SetStateAction<IOffer[]>>
  ) => void
  getTasks?: (
    currentDate: string,
    period: "week" | "month",
    setTasks: Dispatch<SetStateAction<ITask[]>>
  ) => void
  getContracts?: (
    currentDate: string,
    period: "week" | "month",
    setTasks: Dispatch<SetStateAction<IContract[]>>
  ) => void
}

const OffersCalendar: FC = () => {
  moment.updateLocale("en", { week: { dow: 1 } })

  const calendarViewMode = useSelector(
    (state: RootStateType) => state.Calendar.calendarViewMode
  )

  let displayCalendar = null
  switch (calendarViewMode) {
    case "Tag": {
      displayCalendar = <OffersDayCalendar />
      break
    }
    case "Woche": {
      displayCalendar = (
        <OffersWeekCalendar
          getOffers={getOffersForPeriod}
          getContracts={getContractsForPeriod}
          getTasks={getTasksForPeriod}
					/>
      )
      break
    }
    case "Monat": {
      displayCalendar = (
        <div>
          <DaysNames />
          <MonthCalendarGrid
            getOffers={getOffersForPeriod}
            getTasks={getTasksForPeriod}
            getContracts={getContractsForPeriod}
          />
        </div>
      )
      break
    }
  }  

  return (
    <div className={styles.calendar}>
      <CalendarHeader />
      {displayCalendar}
    </div>
  )
}

export default OffersCalendar

async function getOffersForPeriod(
	currentDate: string,
	period: "week" | "month",
	setOffers: Dispatch<SetStateAction<IOffer[]>>
) {
	const filters = {
		delivery_status: "ARRANGED",
		start_date_after: moment(currentDate)
			.startOf(period === "month" ? "month" : "week")
			.startOf("week")
			.format("YYYY-MM-DD"),
		start_date_before: moment(currentDate)
			.endOf(period)
			.add(15, "day")
			.format("YYYY-MM-DD"),
	}
	const response = await API.getOffers(getQueryString(filters))
	setOffers(response.results)
}

async function getContractsForPeriod(
	currentDate: string,
	period: "week" | "month",
	setTasks: Dispatch<SetStateAction<IContract[]>>
) {
	const filters = {
		status: "ARRANGED",
		date_after: moment(currentDate)
			.startOf(period === "month" ? "month" : "week")
			.startOf("week")
			.format("YYYY-MM-DD"),
		date_before: moment(currentDate)
			.endOf(period)
			.add(15, "day")
			.format("YYYY-MM-DD"),
	}
	const response = await API.getContracts(getQueryString(filters))
	setTasks(response.results)
}

export async function getTasksForPeriod(
	currentDate: string,
	period: "week" | "month",
	setTasks: Dispatch<SetStateAction<ITask[]>>
) {
	const filters = {
		date_after: moment(currentDate)
			.startOf(period === "month" ? "month" : "week")
			.startOf("week")
			.format("YYYY-MM-DD"),
		date_before: moment(currentDate)
			.endOf(period)
			.add(15, "day")
			.format("YYYY-MM-DD"),
	}
	let response = await API.getTasks(getQueryString(filters))
	setTasks(response.results)
	while(response.next) {
		const nextPageResponse = await instance.get(response.next.split(".de")[1])
		setTasks(prev => [...prev, ...nextPageResponse.data.results])
		response = nextPageResponse.data
	}
}