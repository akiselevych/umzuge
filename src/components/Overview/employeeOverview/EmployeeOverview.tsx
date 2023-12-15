import EmployeeCell from "components/Tables/Employees/EmployeeCell"
import { FC, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { IEmployee } from "types/tables"
import "styles/index.scss"
import styles from "./EmployeeOverview.module.scss"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { addEmployee, editBonus, editEmployee } from "reduxFolder/slices/Table.slice"
import EditButton from "components/EditButton/EditButton"
import Notification from "components/Notification/Notification"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { removeEmptyValues } from "utils/removeEmptyValues"
import { extractDate } from "utils/extractTaskTimePart"
import EmployeeInput from "./EmployeeInput"
import AddNewEmployeeInputs from "./AddNewEmployeeInputs"
import moment from "moment"
import ModalWindow from "components/ModalWindow/ModalWindow"
import ChangePassword from "./ChangePassword"
import { RolesDict } from "components/TableFilters/EmployeesTableFilters"

export type EmployeeInputsType = {
  email: string | undefined
  first_name: string | undefined
  is_active: boolean | undefined
  last_name: string | undefined
  role: { value: string | undefined; label: string | undefined }
  phone: string | undefined
  date_of_birth: string | undefined
  const_salary: string | null | undefined
  bonus: string | null | undefined
  date_joined: string | undefined
  password: string | undefined
  image: string | undefined
}

const moreInfoFieldsNames = {
  date_of_birth: "Geburtsdatum",
  const_salary: "Lohn",
  date_joined: "Arbeiten seit",
  phone: "Telefon",
  email: "E-mail",
  bonus: "Bonus",
}

const EmployeeOverview: FC<{
  emp?: IEmployee
  isAdding?: boolean
  setCurrentlyOpenedId?: (currentId: string) => void
  setIsModalOpen: (isOpen: boolean) => void
  setIsAddingNotifivationVisible?: (newValue: boolean) => void
}> = ({
  emp,
  setCurrentlyOpenedId,
  setIsModalOpen,
  isAdding,
  setIsAddingNotifivationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEditing, setIsEditing] = useState(!!!emp)

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false)
  const [isEditNotifivationVisible, setIsEditNotifivationVisible] = useState(false)
  const [isPasswordNotifivationVisible, setIsPasswordNotifivationVisible] =
    useState(false)

  const defaultValues: EmployeeInputsType = {
    email: emp?.email || "",
    first_name: emp?.first_name,
    is_active: emp?.is_active,
    last_name: emp?.last_name,
    role: emp
      ? { value: emp.role, label: RolesDict[emp.role as keyof typeof RolesDict] }
      : { value: "courier", label: "Technishce Mitarbeiter" },
    phone: emp?.phone,
    date_of_birth: emp?.date_of_birth,
    const_salary: emp?.const_salary,
    bonus: emp?.bonus?.count ?? "0.00",
    date_joined: emp && extractDate(emp?.date_joined as string),
    password: "",
    image: emp?.image_path,
    ...(isAdding && { password: "" }),
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
  })

  const onSubmit: SubmitHandler<EmployeeInputsType> = async (data) => {
    if (data.role.value) {
      ;(data.role as any) = data.role.value
    }

    data = removeEmptyValues(data) as any

    const { image, ...dataWithoutImage } = data
    const isImage = image && image.length > 0 && typeof image !== "string"
    const formData = new FormData()
    if (isImage) {
      formData.set("image", image[0])
    }

    if (emp) {
      dispatch(
        editEmployee({
          id: +emp.id,
          data: {
            ...(dataWithoutImage as any),
            image: isImage ? formData : undefined,
          },
        })
      )
      dispatch(
        editBonus({
          employee_id: emp.id,
          bonuses: dataWithoutImage.bonus || "0",
          date: moment().format("YYYY-MM-DD"),
        })
      )
      setIsEditing(false)
      setIsEditNotifivationVisible(true)
    } else {
      const response: any = await dispatch(
        addEmployee({
          data: { ...dataWithoutImage, image: isImage ? formData : undefined },
          dispatch,
        })
      )
      if (!response?.payload?.error) {
        setIsModalOpen(false)
        setIsAddingNotifivationVisible && setIsAddingNotifivationVisible(true)
      } else {
        alert(Object.entries(response?.payload?.error)[0][1])
      }
    }
  }

  const watchFields = watch()

  const MoreInfoTextFields = Object.keys(moreInfoFieldsNames).map((n, i) => {
    if (!emp) return

    let displayValue
    if (n === "date_joined") {
      displayValue = moment(extractDate(emp[n as keyof IEmployee] as string)).format(
        "DD-MM-YYYY"
      )
    } else if (n === "date_of_birth") {
      displayValue = emp.date_of_birth
        ? moment(emp[n as keyof IEmployee] as string).format("DD-MM-YYYY")
        : "-"
    } else if (n === "bonus") {
      displayValue = (emp?.bonus?.count ?? 0).toString().replace(".", ",") + " €"
    } else if (n === "const_salary") {
      displayValue = emp?.const_salary?.toString().replace(".", ",") + " €"
    } else {
      displayValue = emp[n as keyof IEmployee] || "-"
    }

    return (
      <div key={i} className={styles.field}>
        <div className={styles.name}>
          {moreInfoFieldsNames[n as keyof typeof moreInfoFieldsNames]}
        </div>
        <div className={styles.value}>
          {displayValue !== undefined && displayValue !== null
            ? (displayValue as string)
            : "-"}
        </div>
      </div>
    )
  })

  const AddNewInputs = Object.keys(moreInfoFieldsNames).map((n, i) => {
    if (n === "bonus" || n === "date_joined") return
    return (
      <EmployeeInput
        key={i}
        name={n}
        registerValue={n}
        register={register}
        watchFields={watchFields}
        errors={errors}
        moreInfoFieldsNames={moreInfoFieldsNames}
      />
    )
  })
  const MoreInfoInputs = Object.keys(moreInfoFieldsNames).map((n, i) => (
    <EmployeeInput
      key={i}
      name={n}
      registerValue={n}
      register={register}
      watchFields={watchFields}
      errors={errors}
      moreInfoFieldsNames={moreInfoFieldsNames}
    />
  ))

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.overview}>
        <div className={styles.header}>
          <h1>Übersicht der Mitarbeiter</h1>
        </div>

        <EmployeeCell
          emp={emp}
          setIsModalOpen={setIsModalOpen}
          setCurrentlyOpenedId={setCurrentlyOpenedId}
          isMapping={false}
          isAdding={isAdding}
          isEditing={isEditing}
          register={register}
          watchFields={watchFields}
          setValue={setValue}
          setIsNotifivationVisible={setIsNotifivationVisible}
        />

        {isAdding ? (
          <div className={styles.fields}>
            <AddNewEmployeeInputs
              register={register}
              errors={errors}
              watchFields={watchFields}
              control={control}
            />
            {AddNewInputs}
          </div>
        ) : (
          <>
            <div className={styles.fields}>
              {!isEditing ? MoreInfoTextFields : MoreInfoInputs}
            </div>
            {!isEditing && (
              <div
                className={styles.changePassword}
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                <button type="button">Passwort ändern</button>
              </div>
            )}
          </>
        )}

        {emp && !isEditing && (
          <EditButton
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isAlignRight
          />
        )}
        {isEditing && <SubmitButton isDisabled={isSubmitting} isAlignRight />}
      </form>

      <ModalWindow
        isModaltOpen={isChangePasswordModalOpen}
        setIsModaltOpen={setIsChangePasswordModalOpen}
        size="tiny"
        withLogo
      >
        <ChangePassword
          emp={emp}
          setIsModalOpen={setIsChangePasswordModalOpen}
          setIsNotifivationVisible={setIsPasswordNotifivationVisible}
        />
      </ModalWindow>

      <div className={styles.notification}>
        <Notification
          text="Das Passwort wurde geändert!"
          isVisible={isPasswordNotifivationVisible}
          setIsvisible={setIsPasswordNotifivationVisible}
        />
      </div>
      <div className={styles.notification}>
        <Notification
          text="Die Nachricht wurde gesendet!"
          isVisible={isNotifivationVisible}
          setIsvisible={setIsNotifivationVisible}
        />
      </div>
      <div className={styles.notification}>
        <Notification
          text="Der Arbeitgeber wurde geändert!"
          isVisible={isEditNotifivationVisible}
          setIsvisible={setIsEditNotifivationVisible}
        />
      </div>
    </>
  )
}

export default EmployeeOverview
