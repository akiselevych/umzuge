import { FC } from "react"
import styles from "./DayInfo.module.scss"
import { useFormContext } from "react-hook-form"
import {
  BothAddressFieldKeys,
  LeadPlanningFieldsType,
  LoadingAddressFieldsType,
  UnloadingAddressFieldsType,
  dayInfoHeaders,
} from "../leadPlanningHelpers"
import classNames from "classnames"
import DayInfoGridRow from "./DayInfoGridRow"

const DayInfo: FC = () => {
  const { watch } = useFormContext<LeadPlanningFieldsType>()
  const currentDay = watch("currentDay")
  const days_info = watch(`days_info`)
  const currentDayInfo = days_info[currentDay - 1]

  const HeadersComponents = dayInfoHeaders.map((h, i) => (
    <div key={i} className={styles.columnHeader}>
      {h}
    </div>
  ))

  const LoadingAddressFieldsComponents = Object.keys(currentDayInfo.loading_address).map((k, i) => {
    const fieldKey = k as keyof LoadingAddressFieldsType
    return (
      <DayInfoGridRow
        key={i}
        name={k as BothAddressFieldKeys}
        fields={currentDayInfo.loading_address[fieldKey]}
      />
    )
  })
  const UnloadingAddressFieldsComponents = Object.keys(currentDayInfo.unloading_address).map(
    (k, i) => {
      const fieldKey = k as keyof UnloadingAddressFieldsType
      return (
        <DayInfoGridRow
          key={i}
          name={k as BothAddressFieldKeys}
          fields={currentDayInfo.unloading_address[fieldKey]}
        />
      )
    }
  )

  return (
    <div>
      <div className={styles.dayInfoWrapper}>
        <div className={styles.dayInfo}>
          <div className={classNames(styles.gridRow, styles.head)}>{HeadersComponents}</div>
          <div className={styles.sectionHeader}>Beladeadresse</div>
          {LoadingAddressFieldsComponents}
          <div className={styles.sectionHeader}>Entladeadresse</div>
          {UnloadingAddressFieldsComponents}
        </div>
      </div>
    </div>
  )
}

export default DayInfo
