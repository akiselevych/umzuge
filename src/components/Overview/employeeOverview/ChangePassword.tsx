import InputMUI from "components/InputMUI/InputMUI"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { changeEmployeePassword } from "reduxFolder/slices/Table.slice"
import "styles/index.scss"
import { AppDispatch } from "types"
import { IEmployee } from "types/tables"
import styles from "./EmployeeOverview.module.scss"

interface FieldsType {
  old_password: string
  new_password: string
  confirm_new_password: string
}

const ChangePassword: FC<{
  emp?: IEmployee
  setIsModalOpen: (isOpen: boolean) => void
  setIsNotifivationVisible: (isVisible: boolean) => void
}> = ({ emp, setIsModalOpen, setIsNotifivationVisible }) => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldsType>()
  const watchFields = watch()

  async function onSubmit(data: FieldsType) {
    if (data.new_password !== data.confirm_new_password) {
      alert("Passwörter stimmen nicht überein")
      return
    }
    if (data.old_password === data.new_password) {
      alert("Neues Passwort darf nicht gleich wie altes sein")
      return
    }
    if (!emp) return

    const response = await dispatch(
      changeEmployeePassword({
        id: +emp.id,
        data: {
          old_password: data.old_password,
          new_password: data.new_password,
        },
      })
    )
    const message = Object.entries(response.payload)[0][1]
    if (message === "Password was changed") {
      setIsModalOpen(false)
      setIsNotifivationVisible(true)
    } else {
      alert(message)
    }
  }

  return (
    <div className={styles.changePasswordPoPUp}>
      <h1 className="modalTitle">Passwort ändern</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputMUI
          register={register}
          name="old_password"
          label="Vorheriges Passwort"
          watchFields={watchFields}
          type="password"
          required
          fieldErrors={errors.old_password}
        />
        <InputMUI
          register={register}
          name="new_password"
          label="Neues Passwort"
          watchFields={watchFields}
          type="password"
          required
          fieldErrors={errors.new_password}
        />
        <InputMUI
          register={register}
          name="confirm_new_password"
          label="Bestätigen Sie das neue Passwort"
          watchFields={watchFields}
          type="password"
          required
          fieldErrors={errors.confirm_new_password}
        />
        <button disabled={isSubmitting}>Speichern</button>
      </form>
    </div>
  )
}

export default ChangePassword
