import ToggleState from "components/ToggleState/ToggleState"
import { useActions } from "hooks/useActions"
import { FC, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import styles from "./CalendarHeader.module.scss"
import arrowIcon from "assets/icons/arrow.svg"
import classNames from "classnames"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "styles/CustomDatePicker.scss"
import { de } from "date-fns/locale"
import { format } from "date-fns"
import moment from "moment"
import "moment/locale/de"
import { replaceGermanMonths } from "utils/replaceGermanMonths"

const CalendarHeader: FC = () => {
  moment.locale("de")
  registerLocale("de", de)

  const calendarViewMode = useSelector(
    (state: RootStateType) => state.Calendar.calendarViewMode
  )
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )
  const currentScreen = useSelector(
    (state: RootStateType) => state.Calendar.currentScreen
  )
  const internalCurrentWorkerType = useSelector(
    (state: RootStateType) => state.Calendar.internalCurrentWorkerType
  )
  const { setCalendarViewMode, setCurrentDate, setInternalCurrentWorkerType } =
    useActions()

  let displayDate = null
  if (currentScreen === "Calendar" && calendarViewMode !== "Monat") {
    displayDate = format(new Date(currentDate), "MMMM d, yyyy", { locale: de })
  } else {
    displayDate = format(new Date(currentDate), "MMMM yyyy", { locale: de })
  }
  if (currentWorkflow === "Accounting") {
    displayDate = format(new Date(currentDate), "MMMM yyyy", { locale: de })
  }

  let displayToggle = null
  switch (currentScreen) {
    case "Calendar": {
      displayToggle = (
        <ToggleState
          options={["Tag", "Woche", "Monat"]}
          currentOption={calendarViewMode}
          onToggle={setCalendarViewMode}
          refreshDate={true}
        />
      )
      break
    }
    case "Internal workers": {
      displayToggle = (
        <ToggleState
          options={["Technische Mitarbeiter", "Verkäufer"]}
          currentOption={internalCurrentWorkerType}
          onToggle={setInternalCurrentWorkerType}
        />
      )
      break
    }
    case "Suppliers": {
      displayToggle = <></>
      break
    }
  }
  if (currentWorkflow === "Accounting") {
    displayToggle = <></>
  }

  function changeDate(isAdd: boolean) {
    if (currentScreen === "Calendar" && currentWorkflow === "Disposition") {
      switch (calendarViewMode) {
        case "Monat": {
          isAdd
            ? setCurrentDate(
                moment(currentDate).add(1, "month").format("YYYY-MM-DD")
              )
            : setCurrentDate(
                moment(currentDate).subtract(1, "month").format("YYYY-MM-DD")
              )
          break
        }
        case "Woche": {
          isAdd
            ? setCurrentDate(moment(currentDate).add(1, "week").format("YYYY-MM-DD"))
            : setCurrentDate(
                moment(currentDate).subtract(1, "week").format("YYYY-MM-DD")
              )
          break
        }
        case "Tag": {
          isAdd
            ? setCurrentDate(moment(currentDate).add(1, "day").format("YYYY-MM-DD"))
            : setCurrentDate(
                moment(currentDate).subtract(1, "day").format("YYYY-MM-DD")
              )
          break
        }
      }
    } else {
      isAdd
        ? setCurrentDate(moment(currentDate).add(1, "month").format("YYYY-MM-DD"))
        : setCurrentDate(
            moment(currentDate).subtract(1, "month").format("YYYY-MM-DD")
          )
    }
  }

  const [isPickerDisplayed, setIsPickerDisplayed] = useState(false)

  function handleDateChange(date: Date) {
    setCurrentDate(moment(date).format("YYYY-MM-DD"))
    setIsPickerDisplayed(false)
  }

  useEffect(() => {
    function handleClickOutside(e: globalThis.MouseEvent) {
      const target = e.target as HTMLElement
      if (
        target.className !== styles.datePicker &&
        !target.closest("div")?.className.includes("react-datepicker") &&
        target.tagName !== "H2" &&
        target.tagName !== "IMG"
      ) {
        setIsPickerDisplayed(false)
      }
    }
    window.addEventListener("click", handleClickOutside)

    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  let displayDatePicker
  if (currentScreen === "Calendar") {
    if (calendarViewMode === "Monat") {
      displayDatePicker = (
        <DatePicker
          selected={new Date(currentDate)}
          onChange={handleDateChange}
          inline
          showMonthYearPicker
          dateFormat="MM/yyyy"
          locale="de"
        />
      )
    } else {
      displayDatePicker = (
        <DatePicker
          selected={new Date(currentDate)}
          onChange={handleDateChange}
          inline
          locale="de"
        />
      )
    }
  } else {
    displayDatePicker = (
      <DatePicker
        selected={new Date(currentDate)}
        onChange={handleDateChange}
        inline
        showMonthYearPicker
        dateFormat="MM/yyyy"
        locale="de"
      />
    )
  }
  if (currentWorkflow === "Accounting") {
    displayDatePicker = (
      <DatePicker
        selected={new Date(currentDate)}
        onChange={handleDateChange}
        inline
        showMonthYearPicker
        dateFormat="MM/yyyy"
        locale="de"
      />
    )
  }

  return (
    <header className={styles.header}>
      <h2 onClick={() => setIsPickerDisplayed(true)}>
        {displayDate}
        <img src={arrowIcon} alt="" />
      </h2>
      {isPickerDisplayed && (
        <div className={classNames(styles.datePicker, "custom-date-picker")}>
          {displayDatePicker}
        </div>
      )}

      {displayToggle}

      {currentWorkflow === "Disposition" && (
        <div className={styles.navigate}>
          <button className={styles.left} onClick={() => changeDate(false)}>
            <img src={arrowIcon} alt="arrow" />
          </button>
          <button
            className={styles.toToday}
            onClick={() => {
              setCurrentDate(moment().format("YYYY-MM-DD"))
            }}
          >
            Heute
          </button>
          <button className={styles.right} onClick={() => changeDate(true)}>
            <img src={arrowIcon} alt="arrow" />
          </button>
        </div>
      )}
    </header>
  )
}

export default CalendarHeader
