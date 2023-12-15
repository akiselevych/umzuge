import { FC, useEffect, useRef, useState } from "react"
import styles from "./InfoManagement.module.scss"
import classNames from "classnames"
import { useFormContext } from "react-hook-form"
import { LeadPlanningFieldsType } from "../leadPlanningHelpers"
import { handleNumberInputChange } from "utils/handelNumberInputChange"

type PropstType = {
  name: string
}

const InfoManagementTimeInput: FC<PropstType> = ({ name }) => {
  const { watch, setValue } = useFormContext<LeadPlanningFieldsType>()
  const watchValue = watch(name as keyof LeadPlanningFieldsType) as string

  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")

  const minutesInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (watchValue) {
      const [watchedHours, watchedMinutes] = watchValue.split(":")
      setHours(watchedHours)
      setMinutes(watchedMinutes)
    } else {
      setHours("")
      setMinutes("")
    }
  }, [watchValue])

  useEffect(() => {
    if (hours && minutes) {
      setValue(name as keyof LeadPlanningFieldsType, `${hours}:${minutes}`)
    }
  }, [hours, minutes])

  function handleHoursChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newHours = e.target.value
    setHours(newHours)
    if (newHours.length === 2) {
      minutesInputRef.current?.focus()
    }
  }

  return (
    <div className={styles.inputWrapper}>
      <div className={classNames(styles.input, styles.timeInputWrapper)}>
        <input
          className={styles.timeInput}
          type="text"
          maxLength={2}
          value={hours}
          onChange={handleHoursChange}
          onKeyDown={handleNumberInputChange}
        />
        {":"}
        <input
          ref={minutesInputRef}
          className={styles.timeInput}
          type="text"
          maxLength={2}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          onKeyDown={handleNumberInputChange}
        />
      </div>
      <span className={classNames(styles.label, styles.active)}>Startzeit</span>
    </div>
  )
}

export default InfoManagementTimeInput
