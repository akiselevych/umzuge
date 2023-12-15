import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { IOffer, ISaleMan } from "types/offers"
import styles from "./OfferOverview.module.scss"
import {
  addOffer,
  editLead,
  editOffer,
  getOffers,
} from "reduxFolder/slices/Table.slice"
import LeftInputs from "./LeftInputs"
import RightInputs from "./RightInputs"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { API, instance } from "services/API"
import plusIcon from "assets/icons/plus.svg"
import { ILead } from "types/tables"
import { useActions } from "hooks/useActions"
import ModalWindow from "components/ModalWindow/ModalWindow"
import LeadOverview from "../leadOverview/LeadOverview"
import ModalWindowHeader from "components/ModalWindow/ModalWindowHeader"
import classNames from "classnames"
import AdditionalPdfButtons from "./AdditionalPdfButtons"

export type OfferInputsType = {
  start_address: string | undefined
  end_address: string | undefined
  price: string | undefined
  customer: { value: string | number; label: string } | undefined
  start_date: string | undefined
  end_date: string | undefined
  delivery_number: string | undefined
  delivery_status: { value: string | undefined; label: string | undefined }
  notes: string | undefined
  sale_man: ISaleMan | undefined | null
  sale_man_id: number | undefined
  pdf_file?: FileList | undefined
  follow_up_date: string | undefined
}

type PropsType = {
  offer?: IOffer
  setIsModalOpen: (newValue: boolean) => void
  setIsAddingNotifivationVisible?: Dispatch<SetStateAction<boolean>>
  isAdding?: boolean
  setIsEditNotificationVisible?: Dispatch<SetStateAction<boolean>>
}

const OfferOverview: FC<PropsType> = ({
  offer,
  setIsModalOpen,
  setIsAddingNotifivationVisible,
  isAdding,
  setIsEditNotificationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [customers, setCustomers] = useState<ILead[]>([])

  const couriers = useSelector((state: RootStateType) => state.Table.couriers)

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [lead, setLead] = useState<ILead | null>(null)

  const { filterOffers } = useActions()

  const defaultValues: OfferInputsType = {
    start_address: offer?.start_address,
    end_address: offer?.end_address,
    price: offer?.price && offer?.price.replace(".", ",") + " €",
    customer: offer?.customer.first_name
      ? {
          value: offer.customer.id,
          label: `${offer.customer.first_name} ${offer.customer.last_name}`,
        }
      : undefined,
    start_date: offer?.start_date,
    end_date: offer?.end_date,
    delivery_number: offer?.delivery_number,
    delivery_status: {
      value: offer?.delivery_status || "ARRANGED",
      label: offer?.delivery_status || "ARRANGED",
    },
    notes: offer?.notes,
    sale_man: offer?.sale_man,
    sale_man_id: undefined,
    follow_up_date: lead?.follow_up_date,
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
  })

  const watchFields = watch()
  const watchPdfFile = watch("pdf_file")

  const initialData = JSON.stringify(defaultValues)

  const onSubmit: SubmitHandler<OfferInputsType> = async (data) => {
    const newData = JSON.stringify(data)

    if (data.delivery_number) {
      data.delivery_number = data.delivery_number.toUpperCase()
    }
    data.price = data.price?.replace(",", ".").replace(" €", "")

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

    if (offer) {
      if (isSendPdf && pdfFile) {
        await API.loadPdf(offer.delivery_number, pdfFile)
      }

      await dispatch(
        editOffer({
          id: offer.id,
          data: {
            start_address: data.start_address,
            end_address: data.end_address,
            customer_name: data.customer?.label,
            start_date: data.start_date,
            end_date: data.end_date,
            delivery_number: data.delivery_number,
            notes: data.notes,
            price: data.price,
            sale_man_id: data.sale_man_id,
          },
        })
      )
      await dispatch(
        editLead({
          id: +offer.customer.id,
          data: { follow_up_date: data.follow_up_date },
        })
      )
      if (data.sale_man_id) dispatch(getOffers())
      if (initialData !== newData) {
        setIsEditNotificationVisible && setIsEditNotificationVisible(true)
      }
      setIsModalOpen(false)
    } else {
      const response = await dispatch(
        addOffer({
          data: {
            start_address: data.start_address,
            end_address: data.end_address,
            customer_name: data.customer?.label,
            start_date: data.start_date,
            end_date: data.end_date,
            delivery_number: data.delivery_number,
            delivery_status: "ARRANGED",
            notes: data.notes,
            price: data.price,
            sale_man_id: data.sale_man_id,
            sent_status: "TO_SEND",
          },
          dispatch,
        })
      )
      if (isSendPdf && pdfFile) {
        await API.loadPdf(response.payload.delivery_number, pdfFile)
      }
      data.customer &&
        (await dispatch(
          editLead({ id: +data.customer.value, data: { status: "Arranged" } })
        ))
      dispatch(getOffers())
      setIsModalOpen(false)
      setIsAddingNotifivationVisible && setIsAddingNotifivationVisible(true)
    }
  }

  useEffect(() => {
    if (customers.length === 0) getAllLeads(setCustomers)
    if (offer?.customer.id) {
      getLeadById(offer.customer.id.toString(), setLead)
    }
  }, [])

  useEffect(() => {
    if (offer?.customer.id) {
      getLeadById(offer.customer.id.toString(), setLead)
    }
  }, [isLeadModalOpen, isSubmitting])

  useEffect(() => {
    setValue("follow_up_date", lead?.follow_up_date)
  }, [lead])

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [lead, isLeadModalOpen])

  // PDF
  function loadWorksPapierenPDF() {
    if (!offer?.pdf_file) return alert("No pdf file")
    window.open(offer.pdf_file, "_blank")
  }

  // Archive
  async function handleArchiveOffer() {
    if (!offer) return
    await dispatch(editOffer({ id: +offer.id, data: { is_archived: true } }))
    filterOffers(offer.id)
    setIsModalOpen(false)
  }
  async function handleRestoreOffer() {
    if (!offer) return
    await dispatch(editOffer({ id: +offer.id, data: { is_archived: false } }))
    filterOffers(offer.id)
    setIsModalOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.offerOverview}>
        {!isAdding && <ModalWindowHeader withLogo />}
        <div className={styles.header}>
          <h1>Angebote übersicht</h1>
        </div>

        <div className={styles.main}>
          <LeftInputs
            customers={customers}
            offer={offer}
            control={control}
            errors={errors}
            register={register}
            setValue={setValue}
            watchFields={watchFields}
            isAdding={isAdding}
            setIsLeadModalOpen={setIsLeadModalOpen}
          />
          <RightInputs
            offer={offer}
            errors={errors}
            register={register}
            couriers={couriers}
            watchFields={watchFields}
            setValue={setValue}
            control={control}
          />
        </div>

        <div className={styles.buttons}>
          {offer?.pdf_file && (
            <button
              type="button"
              onClick={loadWorksPapierenPDF}
              className={styles.button}
            >
              Angebot
            </button>
          )}
          {!offer?.pdf_file && (
            <div
              className={styles.addFile}
              style={errors.pdf_file ? { borderColor: "red" } : {}}
            >
              <label>
                <div className={styles.pdfTitle}>
                  {watchPdfFile && watchPdfFile[0] ? (
                    <div>{watchPdfFile[0]?.name}</div>
                  ) : (
                    <>
                      PDF
                      <div className={styles.plus}>
                        <img src={plusIcon} alt="add" />
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  {...register("pdf_file", { required: true })}
                  accept=".pdf"
                />
              </label>
            </div>
          )}

          {!isAdding && (
            <div className={styles.archive}>
              {offer?.is_archived ? (
                <button
                  type="button"
                  className={classNames(styles.button, styles.restore)}
                  onClick={handleRestoreOffer}
                >
                  Entpacken
                </button>
              ) : (
                offer?.delivery_status !== "ACCEPTED" && (
                  <button
                    type="button"
                    onClick={handleArchiveOffer}
                    className={styles.button}
                  >
                    Angebot abgelehnt
                  </button>
                )
              )}
            </div>
          )}
          {isAdding && <SubmitButton />}
        </div>

        {offer?.is_archived && (
          <AdditionalPdfButtons offer={offer} contract={null} enableAdding />
        )}
      </form>

      {lead && (
        <ModalWindow
          size="medium"
          withLogo={false}
          isModaltOpen={isLeadModalOpen}
          setIsModaltOpen={setIsLeadModalOpen}
          removeCloseButton
        >
          <LeadOverview lead={lead} setIsModalOpen={setIsLeadModalOpen} />
        </ModalWindow>
      )}
    </>
  )
}

export default OfferOverview

export async function getAllLeads(
  setLeads: React.Dispatch<React.SetStateAction<ILead[]>>
) {
  let response = await API.getLeads("status=")
  setLeads(response.results)
  while (response.next) {
    const nextPageResponse = await instance.get(response.next.split(".de")[1])
    setLeads((prev) => [...prev, ...nextPageResponse.data.results])
    response = nextPageResponse.data
  }
}

async function getLeadById(id: string, setLead: React.Dispatch<ILead | null>) {
  const response = await API.getLeadById(id)
  setLead(response)
}
