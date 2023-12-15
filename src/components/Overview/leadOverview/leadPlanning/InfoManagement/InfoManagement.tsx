import { FC } from "react"
import styles from "./InfoManagement.module.scss"
import { useFormContext } from "react-hook-form"
import { LeadPlanningFieldsType } from "../leadPlanningHelpers"
import InfoManagementInputs from "./InfoManagementInputs"

const InfoManagement: FC = () => {
  const { watch, setValue } = useFormContext<LeadPlanningFieldsType>()

  function changeData() {
    const currentDay = watch("currentDay")
    const currentField = watch("currentField")
    const newFieldData = watch("newFieldData")

    const [groupName, fieldName] = currentField.split(".")

    setValue(`days_info.${currentDay - 1}.${groupName}.${fieldName}` as any, newFieldData)
  }

  return (
    <div className={styles.infoManagementWrapper}>
      <InfoManagementInputs />

      <button type="button" className={styles.confirmButton} onClick={changeData}>
        Sparen
      </button>
    </div>
  )
}

export default InfoManagement
