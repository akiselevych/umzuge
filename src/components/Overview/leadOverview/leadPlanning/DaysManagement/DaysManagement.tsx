import { FC } from "react"
import styles from "./DaysManagement.module.scss"
import { useFormContext } from "react-hook-form"
import { LeadPlanningFieldsType, initialDayValues } from "../leadPlanningHelpers"
import arrowIcon from "assets/icons/arrow.svg"

const DaysManagement: FC = () => {
  const { watch, setValue } = useFormContext<LeadPlanningFieldsType>()

  const dayCount = watch("dayCount")
  const currentDay = watch("currentDay")
  const daysInfo = watch("days_info")
  const currentDayInfo = daysInfo[currentDay - 1]

  function handleDayCountChange(operation: "increase" | "decrease") {
    if (operation === "decrease" && dayCount <= 1) {
      return
    }

    if (operation === "increase") {
      setValue("dayCount", dayCount + 1)
      setValue("days_info", [...daysInfo, initialDayValues])
    } else {
      const newDayCount = dayCount - 1
      setValue("dayCount", newDayCount)
      setValue("days_info", daysInfo.slice(0, newDayCount))

      if (currentDay === dayCount) {
        setValue("currentDay", newDayCount)
      }
    }
  }

  function handleCurrentDayChange(operation: "increase" | "decrease") {
    if (
      (operation === "decrease" && currentDay <= 1) ||
      (operation === "increase" && currentDay >= dayCount)
    ) {
      return
    }

    if (operation === "increase") {
      setValue("currentDay", currentDay + 1)
    } else {
      setValue("currentDay", currentDay - 1)
    }
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value
    setValue(`days_info.${currentDay - 1}.date`, newDate)
  }

  return (
    <div className={styles.daysManagementWrapper}>
      <div className={styles.titleBlock}>
        <h1
          className="modalTitle"
          style={{ margin: 0 }}
        >{`Vorplanung Tag ${currentDay}/${dayCount}`}</h1>
      </div>
      <div className={styles.daysManagement}>
        <div className={styles.changeCurrentDay}>
          <button
            type="button"
            className={styles.changeCurrentDayButton}
            onClick={() => handleCurrentDayChange("decrease")}
          >
            <img src={arrowIcon} alt="prev" className={styles.prev} />
          </button>
          <div className={styles.inputBlock}>
            <input type="date" value={currentDayInfo.date} onChange={handleDateChange} />
            <span>Datum</span>
          </div>
          <button
            type="button"
            className={styles.changeCurrentDayButton}
            onClick={() => handleCurrentDayChange("increase")}
          >
            <img src={arrowIcon} alt="next" className={styles.next} />
          </button>
        </div>
        <button
          type="button"
          className={styles.manageButton}
          onClick={() => handleDayCountChange("increase")}
        >
          Tag hinzufügen
        </button>
        <button
          type="button"
          className={styles.manageButton}
          onClick={() => handleDayCountChange("decrease")}
        >
          Tag entfernen
        </button>
      </div>
    </div>
  )
}

export default DaysManagement
