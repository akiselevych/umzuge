import { FC, useEffect } from "react"
import styles from "./InfoManagement.module.scss"
import classNames from "classnames"
import { useFormContext } from "react-hook-form"
import { LeadPlanningFieldsType } from "../leadPlanningHelpers"
import InfoManagementNameSelect from "./InfoManagementNameSelect"
import moment from "moment"
import InfoManagementTimeInput from "./InfoManagementTimeInput"

const InfoManagementInputs: FC = () => {
  const { register, watch, setValue } = useFormContext<LeadPlanningFieldsType>()
  const newFieldData = watch("newFieldData")

  useEffect(() => {
    if (!newFieldData.start_time || !newFieldData.end_time) return

    const startTime = moment(newFieldData.start_time, "HH:mm")
    const endTime = moment(newFieldData.end_time, "HH:mm")

    if (endTime.isBefore(startTime)) {
      setValue("newFieldData.total_time", "-")
      return
    }

    const minutes = endTime.diff(startTime, "minutes")
    const hours = minutes / 60
    let formattedTime = "-"
    if (hours % 1 === 0) {
      formattedTime = `${hours} h`
    } else {
      formattedTime = hours ? `${Math.floor(hours)} h ${minutes % 60} min` : "-"
    }
    setValue("newFieldData.total_time", formattedTime)
  }, [newFieldData.start_time, newFieldData.end_time])

  return (
    <>
      <InfoManagementNameSelect />

      <div className={styles.inputWrapper}>
        <input className={styles.input} type="text" {...register("newFieldData.addition")} />
        <span className={classNames(styles.label, newFieldData.addition.length && styles.active)}>
          Zusatz
        </span>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="number"
          {...register("newFieldData.number_of_helpers")}
        />
        <span
          className={classNames(
            styles.label,
            newFieldData.number_of_helpers.length && styles.active
          )}
        >
          Anz. Helfer
        </span>
      </div>

      {/* time */}
			<InfoManagementTimeInput name="newFieldData.start_time" />
			<InfoManagementTimeInput name="newFieldData.end_time" />

      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          {...register("newFieldData.total_time")}
          disabled
        />
        <span className={classNames(styles.label, styles.active)}>Gesamtzeit</span>
      </div>
    </>
  )
}

export default InfoManagementInputs
