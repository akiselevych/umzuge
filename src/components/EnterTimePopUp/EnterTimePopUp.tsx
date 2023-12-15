import { is } from "immer/dist/internal"
import { FC, useEffect, useState } from "react"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import styles from "./EnterTimePopUp.module.scss"

type PropsType = {
  opened: "start" | "end" | null
  setOpened: (value: "start" | "end" | null) => void
  timeType: "start" | "end"
  register: any
  setValue: any
  getValues: any
  watch: any
  clearErrors?: any
  fields: {
    neededTime: "start_time" | "end_time"
    hours1: "start_time_hours1" | "end_time_hours1"
    hours2: "start_time_hours2" | "end_time_hours2"
    minutes1: "start_time_minutes1" | "end_time_minutes1"
    minutes2: "start_time_minutes2" | "end_time_minutes2"
  }
}

const EnterTimePopUp: FC<PropsType> = ({
  opened,
  setOpened,
  register,
  setValue,
  getValues,
  watch,
  fields,
  timeType,
  clearErrors,
}) => {
  useEffect(() => {
    const neededTime = watch(fields.neededTime)
    if (!fields.neededTime) return

    setValue(fields.hours1, neededTime[0])
    setValue(fields.hours2, neededTime[1])
    setValue(fields.minutes1, neededTime[3])
    setValue(fields.minutes2, neededTime[4])
  }, [opened])

  const [isError, setIsError] = useState(false)

  function handleConfirm() {
    if (
      validateHours(timeHours1Field, timeHours2Field) !== true ||
      validateMinutes(timeMinutes1Field, timeMinutes2Field) !== true
    ) {
      setIsError(true)
      return
    }
    setIsError(false)

    clearErrors && clearErrors(fields.neededTime)
    setValue(
      fields.neededTime,
      getValues(fields.hours1) +
        getValues(fields.hours2) +
        ":" +
        getValues(fields.minutes1) +
        getValues(fields.minutes2)
    )
    setOpened(null)
  }

	function handleCancel() {
		setIsError(false)
		setOpened(null)
	}

  // validation
  const timeHours1Field = watch(fields.hours1)
  const timeHours2Field = watch(fields.hours2)
  const timeMinutes1Field = watch(fields.minutes1)
  const timeMinutes2Field = watch(fields.minutes2)
  const validateHours = (f1: number, f2: number) => {
    const value = `${f1}${f2}`
    if (value.length !== 2) return 

    const isValid = +value >= 0 && +value <= 23
    return isValid 
  }
  const validateMinutes = (f1: number, f2: number) => {
    const value = `${f1}${f2}`
    if (value.length !== 2) return 

    const isValid = +value >= 0 && +value <= 59
    return isValid 
  }

  return (
    <div className={opened === timeType ? styles.enterTimePopUp : styles.hidden}>
      <div className={styles.header}>
        <button type="button" onClick={handleCancel}>
          Abbrechen
        </button>
        Hinzufügen
        <button type="button" onClick={handleConfirm}>
          Fertig
        </button>
      </div>

      <div className={styles.enterTime}>
        <div className={styles.blocks}>
          <div className={styles.block}>
            <div className={styles.inputsHeader}>Stunde</div>
            <div className={styles.enterTimeInputs}>
              <input
                type="text"
                onKeyDown={handleNumberInputChange}
                maxLength={1}
                {...register(fields.hours1)}
              />
              <input
                type="text"
                onKeyDown={handleNumberInputChange}
                maxLength={1}
                {...register(fields.hours2)}
              />
              <span className={styles.semicolumn}>:</span>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.inputsHeader}>Minute</div>
            <div className={styles.enterTimeInputs}>
              <input
                type="text"
                onKeyDown={handleNumberInputChange}
                maxLength={1}
                {...register(fields.minutes1)}
              />
              <input
                type="text"
                onKeyDown={handleNumberInputChange}
                maxLength={1}
                {...register(fields.minutes2)}
              />
            </div>
          </div>
        </div>
        {isError && (
          <span className={styles.errorMessage}>Zeit nicht korrekt ausgefüllt</span>
        )}
      </div>
    </div>
  )
}

export default EnterTimePopUp
