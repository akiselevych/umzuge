import { FC, useEffect } from "react"
import styles from "./InfoManagement.module.scss"
import {
  FieldType,
  LeadPlanningFieldsType,
  LoadingAddressFieldsType,
  UnloadingAddressFieldsType,
  leadPlanningFieldsDict,
  leadPlanningFieldsOptions,
  leadPlanningGroupsDict,
} from "../leadPlanningHelpers"
import classNames from "classnames"
import { useFormContext } from "react-hook-form"

const InfoManagementNameSelect: FC = () => {
  const { watch, setValue } = useFormContext<LeadPlanningFieldsType>()
  const currentDay = watch("currentDay")
  const currentField = watch("currentField")

  useEffect(() => {
    const currentDay = watch("currentDay")
    const days_info = watch(`days_info`)
    const currentDayInfo = days_info[currentDay - 1]

    const [groupName, fieldName] = currentField.split(".")

    let currentDayInfoFields: FieldType | undefined

    if (groupName === "loading_address") {
      const loadingFields = currentDayInfo[groupName] as LoadingAddressFieldsType
      currentDayInfoFields = loadingFields[fieldName as keyof LoadingAddressFieldsType]
    } else if (groupName === "unloading_address") {
      const unloadingFields = currentDayInfo[groupName] as UnloadingAddressFieldsType
      currentDayInfoFields = unloadingFields[fieldName as keyof UnloadingAddressFieldsType]
    }

    if (!currentDayInfoFields) return

    setValue("newFieldData", currentDayInfoFields)
  }, [currentField, currentDay])

  const OptionsComponents = Object.entries(leadPlanningFieldsOptions).map(([groupLabel, items]) => {
    const translatedGroupLabel =
      leadPlanningGroupsDict[groupLabel as keyof typeof leadPlanningGroupsDict]

    const Group = items.map((item) => {
      const translatedItem = leadPlanningFieldsDict[item]
      const itemWithCapitalLetter = translatedItem.charAt(0).toUpperCase() + translatedItem.slice(1)
      return (
        <option key={item} value={`${groupLabel}.${item}`}>
          {itemWithCapitalLetter}
        </option>
      )
    })

    return (
      <optgroup label={translatedGroupLabel} key={groupLabel}>
        {Group}
      </optgroup>
    )
  })

  return (
    <div className={styles.inputWrapper}>
      <select
        className={styles.input}
        value={currentField}
        onChange={(e) => setValue("currentField", e.target.value)}
      >
        {OptionsComponents}
      </select>
      <span className={classNames(styles.label, styles.active)}>Art</span>
    </div>
  )
}

export default InfoManagementNameSelect
