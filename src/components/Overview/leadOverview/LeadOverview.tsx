import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { ILead } from "types/tables"
// Styles
import "styles/index.scss"
import styles from "./LeadOverview.module.scss"
import { SubmitHandler, useForm } from "react-hook-form"
import { leadsHeadersNames } from "../../Tables/Leads/LeadsTable"
import { removeEmptyValues } from "utils/removeEmptyValues"
import { useDispatch } from "react-redux"
import { addLead, editLead } from "reduxFolder/slices/Table.slice"
import { AppDispatch } from "types"
import Notification from "components/Notification/Notification"
import moment from "moment"
import TextInput, { platformOptions } from "./TextInput"
import LeadButtons from "./LeadButtons"
import SubmitButton from "components/SubmitButton/SubmitButton"
import LeadCheckboxes from "./LeadCheckboxes"
import ModalWindowHeader from "components/ModalWindow/ModalWindowHeader"
import ModalWindow from "components/ModalWindow/ModalWindow"
import LeadCalculator from "./LeadCalculator/LeadCalculator"
import LeadPlanning from "./leadPlanning/LeadPlanning"

const contactFieldsNames: (keyof typeof leadsHeadersNames)[] = [
  "Vorname",
  "Nachname",
  "E-Mail",
  "Plattform",
  "Telefonnummer",
  "Anfrage-ID",
]
const dateFieldsNames: (keyof typeof leadsHeadersNames)[] = [
  "Notizen",
  "Lead erhalten",
  "Follow Up Datum",
  "Erstkontaktversuch",
]

export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "4px 4px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    maxHeight: "150px",
    zIndex: 10,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "150px",
    overflowY: "auto",
    zIndex: 10,
  }),
}

type PropsType = {
  lead?: ILead
  isAdding?: boolean
  setIsModalOpen: (newValue: boolean) => void
  setIsAddingNotifivationVisible?: Dispatch<SetStateAction<boolean>>
  setIsEditNotificationVisible?: Dispatch<SetStateAction<boolean>>
}

const LeadOverview: FC<PropsType> = ({
  lead,
  isAdding,
  setIsModalOpen,
  setIsAddingNotifivationVisible,
  setIsEditNotificationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false)
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [isCalculatorModalOpen, isPlanningModalOpen])

  let startData: any = {}
  if (lead) {
    Object.values(leadsHeadersNames).forEach((n) => {
      if (n === "platform") {
        startData[n] = platformOptions.find((p) => p.value === lead?.platform)
      } else if (n === "follow_up_date") {
        startData[n] = lead[n as keyof ILead]
          ? moment(lead[n as keyof ILead] as string).format("YYYY-MM-DD")
          : undefined
      } else {
        startData[n] = lead[n as keyof ILead]
      }
    })
  } else {
    startData = {
      lead_received_on: moment().format("YYYY-MM-DD"),
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: startData,
  })
  const watchAllFields = watch()

  const initialData = JSON.stringify(startData)

  const onSubmit: SubmitHandler<any> = (data) => {
    const newData = JSON.stringify(data)
    if (data.platform) {
      data.platform = data.platform.value
    }
    if (data.follow_up_date === "") {
      data.follow_up_date = undefined
    }

    if (lead) {
      dispatch(editLead({ id: +lead.id, data }))
      if (initialData !== newData) {
        setIsEditNotificationVisible && setIsEditNotificationVisible(true)
      }
    } else {
      const finalData = removeEmptyValues(data)
      dispatch(addLead({ data: finalData, dispatch: dispatch }))
      setIsModalOpen(false)
      setIsAddingNotifivationVisible && setIsAddingNotifivationVisible(true)
    }
    setIsModalOpen(false)
  }

  const ContactInputs = contactFieldsNames.map((f, i) => (
    <TextInput
      key={i}
      lead={lead}
      field={f}
      register={register}
      errors={errors}
      watchAllFields={watchAllFields}
      control={control}
    />
  ))
  const DateInputs = dateFieldsNames.map((f, i) => (
    <TextInput
      key={i}
      lead={lead}
      field={f}
      register={register}
      errors={errors}
      watchAllFields={watchAllFields}
      control={control}
    />
  ))

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {!isAdding && <ModalWindowHeader withLogo />}
        <div className={styles.header}>
          <h1>Lead übersicht</h1>
          <div className={styles.headerButtons}>
            <button type="button" onClick={() => setIsCalculatorModalOpen(true)}>
              Langstrecken Rechner
            </button>
            <button type="button" onClick={() => setIsPlanningModalOpen(true)}>
              Vorplanung starten
            </button>
          </div>
        </div>

        <div className={styles.textInputs}>
          <div className={styles.column}>
            <h2>Kontaktdaten</h2>
            {ContactInputs}
            <div className={styles.status}>
              <h2>Bearbeitungsfelder</h2>
              <LeadButtons lead={lead} setIsModalOpen={setIsModalOpen} />
            </div>
          </div>
          <div className={styles.column}>
            <h2>Datum</h2>
            {DateInputs}
            <LeadCheckboxes lead={lead} register={register} watch={watch} errors={errors} />
          </div>
        </div>

        {isAdding && <SubmitButton isAlignRight />}
      </form>

      <ModalWindow
        isModaltOpen={isCalculatorModalOpen}
        setIsModaltOpen={setIsCalculatorModalOpen}
        size="medium"
        withLogo
      >
        <LeadCalculator />
      </ModalWindow>
      <ModalWindow
        isModaltOpen={isPlanningModalOpen}
        setIsModaltOpen={setIsPlanningModalOpen}
        size="medium"
        withLogo
      >
        <LeadPlanning />
      </ModalWindow>
    </>
  )
}

export default LeadOverview
