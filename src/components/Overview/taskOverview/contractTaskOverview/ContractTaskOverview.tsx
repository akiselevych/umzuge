import { getAllLeads } from "components/Overview/offerOverview/OfferOverview"
import SubmitButton from "components/SubmitButton/SubmitButton"
import moment from "moment"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { addTask, editTask } from "reduxFolder/slices/Calendar.slice"
import { editContract, getCouriers, getLeads } from "reduxFolder/slices/Table.slice"
import { API } from "services/API"
import { AppDispatch, RootStateType } from "types"
import { ContractTasksFieldsType, ITask, IVacation } from "types/calendar"
import { IContract, ILead } from "types/tables"
import { removeSeconds } from "utils/extractTaskTimePart"
import styles from "../TaskOverview.module.scss"
import TaskInputs from "./TaskInputs"
import { getDayVacations } from "components/Calendar/DayCalendar/EmployeeDayCalendar/CalendarTable"
import PdfButtons from "../PdfButtons"
import AdditionalPdfButtons from "components/Overview/offerOverview/AdditionalPdfButtons"

type PropsType = {
  task: ITask | undefined
  contract: IContract | undefined
  setIsModalOpen?: (value: boolean) => void
  refreshTasksOffers?: () => void
  setIsEditNotificationVisible?: Dispatch<SetStateAction<boolean>>
  setIsAddNotificationVisible?: Dispatch<SetStateAction<boolean>>
}

type ContractTaskOverviewFieldsType = ContractTasksFieldsType & {
  pdf_file?: FileList | undefined
}

const ContractTaskOverview: FC<PropsType> = ({
  task,
  contract,
  refreshTasksOffers,
  setIsAddNotificationVisible,
  setIsEditNotificationVisible,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [customers, setCustomers] = useState<ILead[]>([])
  const couriers = useSelector((state: RootStateType) => state.Table.couriers)
  const cars = useSelector((state: RootStateType) => state.Table.cars)

  const [vacations, setVacations] = useState<IVacation[] | null>(null)
  const [dayTasks, setDayTasks] = useState<ITask[] | null>(null)

  const contractTasks = dayTasks?.filter(
    (t) => t.contract?.date === task?.contract?.date
  )
  const isExternalItems = !dayTasks
    ? true
    : (contractTasks?.some(
        (t) => t.external_workers || t.car.some((c) => c.is_external)
      ) &&
        !!task) ||
      false

  const availableCouriers = couriers.filter(
    (courier) =>
      !dayTasks?.some(
        (t) =>
          t.courier?.id === courier.id ||
          vacations?.some((v) => v.employee.id === courier.employee.id)
      )
  )
  const availableCars = cars.filter(
    (car) => !dayTasks?.some((t) => t.car.some((c) => c.id === car.id))
  )

  const taskCars = task?.car.map((c) => ({
    value: c.id,
    label: `${c.name} ${c.number}`,
  }))

  const defaultValues: ContractTaskOverviewFieldsType = {
    contract: task?.contract ?? contract,
    date: task?.date ?? contract?.date,
    courier_id: task?.courier
      ? {
          value: task?.courier?.id,
          label: `${task?.courier?.employee.first_name} ${task?.courier?.employee.last_name}`,
        }
      : undefined,
    cars: taskCars,
    notes: task?.description,
    start_time: task?.start_time ? removeSeconds(task?.start_time) : "00:00",
    start_time_hours1: "1",
    start_time_hours2: "2",
    start_time_minutes1: "0",
    start_time_minutes2: "0",
    end_time: task?.end_time ? removeSeconds(task?.end_time) : "00:00",
    end_time_hours1: "1",
    end_time_hours2: "6",
    end_time_minutes1: "0",
    end_time_minutes2: "0",
    materials: {
      "Kleiderbox groß": task?.materials?.["Kleiderbox groß"] ?? 0,
      "Kleiderbox klein": task?.materials?.["Kleiderbox klein"] ?? 0,
      Halteverbotszone: task?.materials?.["Halteverbotszone"] ?? 0,
      Bücherkarton: task?.materials?.["Bücherkarton"] ?? 0,
      Plastikbox: task?.materials?.["Plastikbox"] ?? 0,
      Klebeband: task?.materials?.["Klebeband"] ?? 0,
      Kreppband: task?.materials?.["Kreppband"] ?? 0,
      "Vorsicht Glas Klebeband": task?.materials?.["Vorsicht Glas Klebeband"] ?? 0,
      "Rolle Luftpolsterfolie": task?.materials?.["Rolle Luftpolsterfolie"] ?? 0,
      Werkzeugkoffer: task?.materials?.["Werkzeugkoffer"] ?? 0,
    },
  }

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  })

  const watchPdfFile = watch("pdf_file")

  const onSubmit: SubmitHandler<ContractTaskOverviewFieldsType> = async (data) => {
    data.cars = data.cars?.map((car: any) => car.value ?? car)

    const startTime = moment(data.start_time, "HH:mm")
    const endTime = moment(data.end_time, "HH:mm")

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

    if (task) {
      if (isExternalItems) {
        setIsModalOpen && setIsModalOpen(false)
        return
      }
      await dispatch(
        editContract({
          id: task.contract!.id,
          data: { date: data.date },
        })
      )
      for (const contractTask of contractTasks ?? []) {
        await dispatch(
          editTask({
            id: contractTask.id,
            data: {
              ...(contractTask.id === task.id
                ? { courier_id: data.courier_id?.value }
                : {}),
              description: data.notes,
              materials: data.materials,
              car: data.cars,
              date: data.date,
              start_time: data.start_time,
              end_time: data.end_time,
            },
          })
        )
      }
      refreshTasksOffers && refreshTasksOffers()
      setIsModalOpen && setIsModalOpen(false)
      setIsEditNotificationVisible && setIsEditNotificationVisible(true)
    } else {
      if (contract) {
        if (endTime.isAfter(startTime)) {
          if (isSendPdf && pdfFile) {
            await API.loadPdfForContractTask(contract.id.toString(), pdfFile)
          }

          const addTaskPromises = (data.courier_id as any).map(
            (id: { value: number; label: number }) => {
              return dispatch(
                addTask({
                  courier_id: id.value,
                  contract_id: contract.id,
                  car: (data.cars as any) || [],
                  title: data.contract?.firm,
                  description: data.notes || "description",
                  date: data.date,
                  start_time: data.start_time,
                  end_time: data.end_time,
                  is_active: true,
                  is_done: false,
                  materials: data.materials,
                })
              )
            }
          )

          try {
            const addTaskResults = await Promise.all(addTaskPromises)
            const allTasksAddedSuccessfully = addTaskResults.every(
              (result) => result.meta.requestStatus !== "rejected"
            )

            if (allTasksAddedSuccessfully) {
              await dispatch(
                editContract({
                  id: contract.id,
                  data: { status: "ASSIGNED" },
                })
              )
              refreshTasksOffers && refreshTasksOffers()
              setIsModalOpen && setIsModalOpen(false)
              setIsAddNotificationVisible && setIsAddNotificationVisible(true)
            } else {
              console.log("Some tasks were not added successfully")
            }
          } catch (error) {
            console.log("An error occurred while adding tasks:", error)
          }
        } else {
          setError("end_time", {
            message: "Die Endzeit muss nach der Startzeit liegen",
          })
          return
        }
      }
    }
  }

  async function getDayTasks() {
    const date = task?.date || task?.contract?.date || contract?.date
    const response = await API.getTasks(`date_after=${date}&date_before=${date}`)
    setDayTasks(response.results)
  }

  useEffect(() => {
    if (customers.length === 0) getAllLeads(setCustomers)
    if (couriers.length === 0) dispatch(getCouriers())
    getDayTasks()
    getDayVacations(task?.date || contract!.date, setVacations)
  }, [])

  if (customers.length === 0 || couriers.length === 0) return <div>Laden...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.offerOverview}>
      <div className={styles.header}>
        <h1>Verträge übersicht</h1>
      </div>

      <div className={styles.main}>
        <TaskInputs
          task={task}
          contract={contract}
          availableCars={availableCars}
          customers={customers}
          availableCouriers={availableCouriers}
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          getValues={getValues}
          setValue={setValue}
          isExternalItems={isExternalItems}
        />
      </div>

      <div className={styles.footer}>
        <PdfButtons<ContractTaskOverviewFieldsType>
          task={task}
          register={register}
          errors={errors}
          watchPdfFile={watchPdfFile}
          pdfFileRegisterName="pdf_file"
        />

        <SubmitButton />
      </div>

      {(!!task?.contract?.additional_documents.length ||
        !!contract?.additional_documents.length) && (
        <AdditionalPdfButtons
          offer={null}
          contract={task?.contract || contract || null}
        />
      )}
    </form>
  )
}

export default ContractTaskOverview
