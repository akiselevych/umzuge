import InputMUI from "components/InputMUI/InputMUI"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { addCompany, editCompany } from "reduxFolder/slices/Table.slice"
import { AppDispatch } from "types"
import styles from "./AddCompany.module.scss"
import { ICompany } from "types/tables"

type InputsType = {
  name: string
  address: string
  phone: string
  email: string
  website: string
}

const inputNamesDict = {
  name: "Name",
  address: "Adresse",
  email: "E-Mail",
  phone: "Telefon",
  website: "Website",
}

type PropsType = {
  company?: ICompany
  setIsAddCompanyModalOpen: (isOpen: boolean) => void
  setIsNotifivationVisible: (isVisible: boolean) => void
}

const AddCompany: FC<PropsType> = ({
  company,
  setIsAddCompanyModalOpen,
  setIsNotifivationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsType>({ defaultValues: company })

  const watchFields = watch()

  async function onSubmit(data: InputsType) {
    if (company) {
      await dispatch(editCompany({ id: company.id, data }))
    } else {
      await dispatch(addCompany(data))
    }
    setIsAddCompanyModalOpen(false)
    setIsNotifivationVisible(true)
  }

  const Inputs = Object.keys(inputNamesDict).map((n) => (
    <InputMUI
      key={n}
      name={n}
      label={inputNamesDict[n as keyof typeof inputNamesDict]}
      register={register}
      type={n === "email" ? "email" : "text"}
      watchFields={watchFields}
      required={n === "name" || n === "email"}
      fieldErrors={errors[n as keyof typeof errors]}
    />
  ))

  return (
    <form className={styles.addCompany} onSubmit={handleSubmit(onSubmit)}>
      <header className={styles.header}>
        <h1 className={styles.title}>Unternehmen</h1>
      </header>

      <main className={styles.main}>{Inputs}</main>
      <SubmitButton isAlignRight />
    </form>
  )
}

export default AddCompany
