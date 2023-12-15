import classNames from "classnames"
import InputMUI from "components/InputMUI/InputMUI"
import { FC, MouseEvent } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { editVacaion } from "reduxFolder/slices/Calendar.slice"
import { AppDispatch, RootStateType } from "types"
import { IVacation } from "types/calendar"
import styles from "./VacationRequest.module.scss"

type VacationRequestForm = {
  start_date: string
  end_date: string
}

const VacationRequest: FC<{ vacation: IVacation }> = ({ vacation }) => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootStateType) => state.User.user)

  const defaultValues = {
    start_date: vacation.start_date,
    end_date: vacation.end_date,
  }

  const {
    register,
    watch,
    formState: { isLoading },
  } = useForm<VacationRequestForm>({
    defaultValues: defaultValues,
  })
  const watchFields = watch()

  async function handleApprove(e: MouseEvent) {
    e.preventDefault()
		if(!user) return
    await dispatch(
      editVacaion({
        id: vacation.id,
        data: {
          approved: true,
          approved_by_id: +user.id,
        },
      })
    )
  }

  async function handleDecline(e: MouseEvent) {
    e.preventDefault()
		if(!user) return
    await dispatch(
      editVacaion({
        id: vacation.id,
        data: {
          approved: false,
          approved_by_id: +user.id,
        },
      })
    )
  }

  return (
    <div className={styles.wrapper}>
      <h1 className="modalTitle">Urlaubsanfrage</h1>
      <form className={styles.main}>
        <InputMUI
          name="start_date"
          label="Von"
          register={register}
          type="date"
          watchFields={watchFields}
          disabled
        />
        <InputMUI
          name="end_date"
          label="Bis"
          register={register}
          type="date"
          watchFields={watchFields}
          disabled
        />

        <div className={styles.buttons}>
          <button
            className={classNames(
              styles.approve,
              vacation.approved === true && styles.active
            )}
            disabled={vacation.approved !== null || isLoading}
            onClick={handleApprove}
          >
            Akzeptieren
          </button>
          <button
            className={classNames(
              styles.decline,
              vacation.approved === false && styles.active
            )}
            disabled={vacation.approved !== null || isLoading}
            onClick={handleDecline}
          >
            Ablehnen
          </button>
        </div>
      </form>
    </div>
  )
}

export default VacationRequest
