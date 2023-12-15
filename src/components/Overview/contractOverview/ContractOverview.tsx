import EditButton from "components/EditButton/EditButton"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { contractFields } from "components/Tables/Contracts/ContractsTable"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { addContract, editContract, getContracts } from "reduxFolder/slices/Table.slice"
import { AppDispatch } from "types"
import { IContract, contractCarsInfoType, contractWorkersInfoType } from "types/tables"
import styles from "./ContractOverview.module.scss"
import offerStyles from "../offerOverview/OfferOverview.module.scss"
import Notification from "components/Notification/Notification"
import TextField from "./TextField"
import InputField from "./InputField"
import AdditionalPdfButtons from "../offerOverview/AdditionalPdfButtons"
import classNames from "classnames"
import { useActions } from "hooks/useActions"
import moment from "moment"
import { getFormattedTime } from "utils/getFormattedTime"
import plusIcon from "assets/icons/plus.svg"
import { API } from "services/API"

export type FormValues = {
  [key in keyof Omit<
    IContract,
    | "id"
    | "status"
    | "additional_documents"
    | "is_archived"
    | "cars_info"
    | "workers_info"
    | "sent_status"
    | "sent_date"
    | "paid_date"
    | "pdf_file"
    | "price"
  >]: string
} & {
  workers_info: contractWorkersInfoType
  cars_info: contractCarsInfoType
  is_archived: boolean
  pdf_file?: FileList | undefined
}

export const initialWorkersInfo: contractWorkersInfoType = {
  "Fachkraft/Träger": { hourly_wage: 0, coming_fee: 0, amount: 0 },
  Monteur: { hourly_wage: 0, coming_fee: 0, amount: 0 },
  "LKW Fahrer 3,5t": { hourly_wage: 0, coming_fee: 0, amount: 0 },
  "LKW Fahrer ab 7,5t": { hourly_wage: 0, coming_fee: 0, amount: 0 },
  Sonstiges: { hourly_wage: 0, coming_fee: 0, amount: 0 },
}
export const initialCarsInfo: contractCarsInfoType = {
  "LKW 3,5t": { daily_wage: 0, amount: 0 },
  "LKW 7,5t": { daily_wage: 0, amount: 0 },
  "LKW 12t": { daily_wage: 0, amount: 0 },
  "LKW 18t": { daily_wage: 0, amount: 0 },
  "LKW 40t Sattelzug": { daily_wage: 0, amount: 0 },
  Möbellift: { daily_wage: 0, amount: 0 },
}

type PropsType = {
  contract?: IContract
  setIsModalOpen?: (value: boolean) => void
  setIsAddingNotifivationVisible?: (value: boolean) => void
}

const ContractOverview: FC<PropsType> = ({
  contract,
  setIsModalOpen,
  setIsAddingNotifivationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [isEditing, setIsEditing] = useState(!contract)
  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)
  const [timeEnterOpened, setTimeEnterOpened] = useState<"start" | "end" | null>(null)

  const { filterContracts, setContractDisplayCategory } = useActions()

  const initialValues: FormValues = {
    firm: contract?.firm || "",
    date: contract?.date || "",
    start_address: contract?.start_address || "",
    end_address: contract?.end_address || "",
    email: contract?.email || "",
    phone: contract?.phone || "",
    cars_info: contract?.cars_info || initialCarsInfo,
    workers_info: contract?.workers_info || initialWorkersInfo,
    is_archived: contract?.is_archived || false,
    start_time: getFormattedTime(contract?.start_time),
    end_time: getFormattedTime(contract?.end_time),
    customer_name: contract?.customer_name || "",
  }

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: initialValues })

  const watchFields = watch()
  const watchPdfFile = watch("pdf_file")

  async function onSubmit(data: FormValues) {
    if (!data.firm) return

    const startTime = moment(data.start_time, "HH:mm")
    const endTime = moment(data.end_time, "HH:mm")
    if (!endTime.isAfter(startTime)) {
      setError("end_time", {
        message: "Die Endzeit muss nach der Startzeit liegen",
      })
      return
    }

    let pdfFile = data.pdf_file?.[0] || null

    let isSendPdf = false
    if (pdfFile) {
      isSendPdf = true
      const selectedFile = pdfFile
      const modifiedFile = new File([selectedFile], "from_email.pdf", {
        type: selectedFile.type,
      })
      pdfFile = modifiedFile
    }

    if (!contract) {
      const response = await dispatch(
        addContract({
          data: {
            start_address: data.start_address,
            end_address: data.end_address,
            date: data.date,
            firm: data.firm,
            status: "PENDING",
            workers_info: data.workers_info,
            phone: data.phone,
            email: data.email,
            is_archived: false,
            cars_info: data.cars_info,
            start_time: data.start_time,
            end_time: data.end_time,
            sent_status: "TO_SEND",
            customer_name: data.customer_name,
          },
          dispatch,
        })
      )

      if (isSendPdf && pdfFile) {
        await API.loadPdfForContractTask(response.payload.id, pdfFile)
      }
      await API.contractSendConfirmationEmail(response.payload.id)

      dispatch(getContracts({ status: "PENDING" }))
      setContractDisplayCategory("Pending")
      setIsModalOpen && setIsModalOpen(false)
      setIsAddingNotifivationVisible && setIsAddingNotifivationVisible(true)
      return
    }

    dispatch(
      editContract({
        id: contract.id,
        data: {
          start_address: data.start_address,
          end_address: data.end_address,
          date: data.date,
          firm: data.firm,
          email: data.email,
          phone: data.phone,
          workers_info: data.workers_info,
          cars_info: data.cars_info,
          start_time: data.start_time,
          end_time: data.end_time,
          customer_name: data.customer_name,
        },
      })
    )
    setIsEditing(false)
    setIsEditNotificationVisible(true)
  }

  const TextFields = Object.keys(contractFields).map((n, i) =>
    contract ? (
      <TextField
        key={i}
        contract={contract}
        property={n as keyof IContract}
        watchFields={watchFields}
        setValue={setValue}
      />
    ) : null
  )

  const InputFields = Object.keys(contractFields).map((n, i) => (
    <InputField
      key={i}
      property={n as keyof FormValues}
      register={register}
      errors={errors}
      setValue={setValue}
      watch={watch}
      getValues={getValues}
      timeEnterOpened={timeEnterOpened}
      setTimeEnterOpened={setTimeEnterOpened}
    />
  ))

  async function handleAcceptContract() {
    if (!contract) return
    await dispatch(editContract({ id: +contract.id, data: { status: "ARRANGED" } }))
    filterContracts(contract.id)
    setIsModalOpen && setIsModalOpen(false)
  }
  async function handleArchiveContract() {
    if (!contract) return
    await dispatch(editContract({ id: +contract.id, data: { is_archived: true } }))
    filterContracts(contract.id)
    setIsModalOpen && setIsModalOpen(false)
  }
  async function handleRestoreContract() {
    if (!contract) return
    await dispatch(editContract({ id: +contract.id, data: { is_archived: false } }))
    filterContracts(contract.id)
    setIsModalOpen && setIsModalOpen(false)
  }

  function loadWorksPapierenPDF() {
    if (!contract?.pdf_file) return alert("No pdf file")
    window.open(contract.pdf_file, "_blank")
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.contractOverview}>
        <header className={styles.header}>
          <h1>Personaldienstleistungen</h1>
        </header>

        <main className={styles.main}>
          <>{!isEditing ? TextFields : InputFields}</>
        </main>
        {errors.end_time?.message && errors.end_time.message.length > 0 && (
          <span className={styles.errorMessage}>{errors.end_time.message}</span>
        )}

        <div className={offerStyles.buttons}>
          {contract?.pdf_file && (
            <button type="button" onClick={loadWorksPapierenPDF} className={offerStyles.button}>
              Angebot
            </button>
          )}
          {!!contract && contract.status !== "PENDING" && (
            <div className={offerStyles.archive}>
              {contract?.is_archived ? (
                <button
                  type="button"
                  className={classNames(offerStyles.button, offerStyles.restore)}
                  onClick={handleRestoreContract}
                >
                  Entpacken
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleArchiveContract}
                  className={offerStyles.button}
                >
                  Personaldienstleistungen abgelehnt
                </button>
              )}
            </div>
          )}
        </div>

        <footer
          className={styles.footer}
          style={contract && contract.status !== "PENDING" ? { justifyContent: "flex-end" } : {}}
        >
          {contract?.status === "PENDING" && (
            <div className={offerStyles.buttons}>
              <button
                type="button"
                className={classNames(styles.button, styles.accept)}
                onClick={handleAcceptContract}
              >
                Bestätigen Sie
              </button>
              <button
                type="button"
                className={classNames(styles.button, styles.decline)}
                onClick={handleArchiveContract}
              >
                Ablehnen
              </button>
            </div>
          )}
          {!isEditing && contract && (
            <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
          )}
          {isEditing && !contract?.pdf_file && (
            <div
              className={offerStyles.addFile}
              style={errors.pdf_file ? { borderColor: "red" } : {}}
            >
              <label>
                <div className={offerStyles.pdfTitle}>
                  {watchPdfFile && watchPdfFile[0] ? (
                    <div>{watchPdfFile[0]?.name}</div>
                  ) : (
                    <>
                      PDF
                      <div className={offerStyles.plus}>
                        <img src={plusIcon} alt="add" />
                      </div>
                    </>
                  )}
                </div>
                <input type="file" {...register("pdf_file", { required: true })} accept=".pdf" />
              </label>
            </div>
          )}
          {isEditing && <SubmitButton text={!!contract ? undefined : "Angebot versenden"} />}
        </footer>

        {contract?.is_archived && (
          <AdditionalPdfButtons offer={null} contract={contract} enableAdding />
        )}
      </form>

      <div className={styles.notification}>
        <Notification
          text="Verträge wurde geändert!"
          isVisible={isEditNotificationVisible}
          setIsvisible={setIsEditNotificationVisible}
        />
      </div>
    </>
  )
}

export default ContractOverview
