import { FC, useEffect } from "react"
import styles from "components/TableFilters/TableFilters.module.scss"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { getEmployees } from "reduxFolder/slices/Table.slice"
import calendarIcon from "assets/icons/calendar.svg"

export const RolesDict = {
  courier: "Technische Mitarbeiter",
  sale_man: "Verkäufer",
  disposition: "Verfügung",
  admin: "Admin",
}

const EmployeesTableFilters: FC<{
  setIsEventsOpen: (value: boolean) => void
}> = ({setIsEventsOpen}) => {
  const dispatch = useDispatch<AppDispatch>()

  const { register, handleSubmit, watch } = useForm()
  const onSubmit: SubmitHandler<any> = (data) => {
    const checkedRoles = Object.keys(data)
      .filter((key) => data[key])
      .join(",")
    dispatch(getEmployees(checkedRoles))
  }

  const watchFilters = watch()
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe()
  }, [watchFilters])

  const checkboxes = Object.keys(RolesDict).map((ch, i) => (
    <label key={i}>
      <input type="checkbox" {...register(ch)} />
      {RolesDict[ch as keyof typeof RolesDict]}
    </label>
  ))

  return (
    <div className={styles.employee}>
      <div className={styles.checkboxes}>{checkboxes}</div>
      <button onClick={() => setIsEventsOpen(true)} className={styles.eventButton}>
        <img src={calendarIcon} alt="events" />
      </button>
    </div>
  )
}

export default EmployeesTableFilters
