import classNames from "classnames"
import InputMUI from "components/InputMUI/InputMUI"
import { selectStyles } from "components/Overview/taskOverview/offerTaskOverview/TaskInputs"
import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import Select from "react-select"
import { addVacation } from "reduxFolder/slices/Calendar.slice"
import { AppDispatch, RootStateType } from "types"
import styles from "./DispositionVacation.module.scss"
import { IAddVacation } from "types/calendar"
type PropsType = {
  employeeId: string
  setIsVacationNotification: (isOpen: boolean) => void
  setIsOpen: (isOpen: boolean) => void
	setVacationForEmployeeId: (employeeId: string | null) => void
}

type VacationForm = {
  type: { value: string; label: string }
  start_date: string
  end_date: string
}

const DispositionVacation: FC<PropsType> = ({
  employeeId,
  setIsOpen,
  setIsVacationNotification,
	setVacationForEmployeeId
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector((state: RootStateType) => state.User.user)

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { isLoading },
  } = useForm<VacationForm>()
  const watchFields = watch()

  async function submithandler(data: VacationForm) {
    const result: IAddVacation = {
      approved_by_id: +user!.id,
      approved: true,
      employee_id: +employeeId,
      type: data.type.value as "paid" | "sick",
      start_date: data.start_date,
      end_date: data.end_date,
      notes: data.type.label,
    }

    const response = await dispatch(addVacation(result))
    if (response.meta.requestStatus === "fulfilled") {
			setIsOpen(false)
			setVacationForEmployeeId(null)
			setIsVacationNotification(true)
    } else {
      alert("Something went wrong")
    }
  }

  const typeOptions = [
    { value: "paid", label: "Urlaubsanfrage" },
    { value: "sick", label: "Krankheitsurlaub" },
  ]

  return (
    <div className={styles.wrapper}>
      <h1 className="modalTitle">Antrag auf Urlaub</h1>
      <form className={styles.main} onSubmit={handleSubmit(submithandler)}>
        <div className={styles.group}>
          <Controller
            name="type"
            rules={{ required: true }}
            control={control}
            render={({ field }) => (
              <Select
                options={typeOptions}
                placeholder="Wählen Sie"
                {...field}
                styles={selectStyles}
              />
            )}
          />
          <span className={classNames(styles.span, styles.active)}>Typ</span>
        </div>

        <InputMUI
          name="start_date"
          label="Von"
          register={register}
          type="date"
          watchFields={watchFields}
          required
        />
        <InputMUI
          name="end_date"
          label="Bis"
          register={register}
          type="date"
          watchFields={watchFields}
          required
        />

        <button disabled={isLoading}>Senden Sie</button>
      </form>
    </div>
  )
}

export default DispositionVacation
