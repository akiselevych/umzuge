import { FC } from "react"
import styles from "./DayInfo.module.scss"
import { BothAddressFieldKeys, FieldType, leadPlanningFieldsDict } from "../leadPlanningHelpers"
import { useFormContext } from "react-hook-form"

type PropstType = {
  name: BothAddressFieldKeys
  fields: FieldType
}

const DayInfoGridRow: FC<PropstType> = (props) => {
  const { name, fields } = props

  const { watch } = useFormContext()
  const currentDay = watch("currentDay")

  const germanName = leadPlanningFieldsDict[name]
  const displayingName = germanName?.charAt(0).toUpperCase() + germanName?.slice(1)

  const FieldsComponents = Object.keys(fields).map((k, i) => {
    const fieldKey = k as keyof FieldType
    if (fieldKey === "total_time") return
    return (
      <div key={i} className={styles.columnCell}>
        {fields[fieldKey]}
      </div>
    )
  })

  return (
    <div className={styles.gridRow}>
      <div className={styles.columnCell}>{displayingName}</div>
      {FieldsComponents}
      <div className={styles.columnCell}>Tag {currentDay}</div>
    </div>
  )
}

export default DayInfoGridRow
