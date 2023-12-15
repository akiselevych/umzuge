import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { IOffer } from "types/offers"
import { editOffer, getCouriers } from "reduxFolder/slices/Table.slice"
import moment from "moment"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { addTask, editTask } from "reduxFolder/slices/Calendar.slice"
import { ITask, IVacation, TasksFieldsType } from "types/calendar"
import styles from "../TaskOverview.module.scss"
import { removeSeconds } from "utils/extractTaskTimePart"
import TaskInputs from "./TaskInputs"
import { API } from "services/API"
import { getDayVacations } from "components/Calendar/DayCalendar/EmployeeDayCalendar/CalendarTable"
import { ILead } from "types/tables"
import { getAllLeads } from "components/Overview/offerOverview/OfferOverview"
import PdfButtons from "../PdfButtons"
import AdditionalPdfButtons from "components/Overview/offerOverview/AdditionalPdfButtons"

type PropsType = {
  task: ITask | undefined
  offer: IOffer | undefined
  setIsModalOpen?: (value: boolean) => void
  refreshTasksOffers?: () => void
  setIsEditNotificationVisible?: Dispatch<SetStateAction<boolean>>
  setIsAddNotificationVisible?: Dispatch<SetStateAction<boolean>>
}

export type TaskOverviewFieldsType = TasksFieldsType & {
  pdf_file?: FileList | undefined
}

const OfferTaskOverview: FC<PropsType> = ({
  task,
  offer,
  setIsModalOpen,
  refreshTasksOffers,
  setIsEditNotificationVisible,
  setIsAddNotificationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [customers, setCustomers] = useState<ILead[]>([])

  const couriers = useSelector((state: RootStateType) => state.Table.couriers)
  const cars = useSelector((state: RootStateType) => state.Table.cars)

  const [vacations, setVacations] = useState<IVacation[] | null>(null)

  const [dayTasks, setDayTasks] = useState<ITask[] | null>(null)
  const offerTasks = dayTasks?.filter(
    (t) => t.delivery?.delivery_number === task?.delivery?.delivery_number
  )

  const isExternalItems = !dayTasks
    ? true
    : (offerTasks?.some(
        (t) => t.external_workers?.id || t.car.some((c) => c.is_external)
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

  const defaultValues: TaskOverviewFieldsType = task
    ? {
        start_address: task.delivery?.start_address,
        end_address: task.delivery?.end_address,
        price: task.delivery?.price,
        customer_name: `${task.delivery?.customer.first_name} ${task.delivery?.customer.last_name}`,
        courier_id: task?.courier
          ? {
              value: task?.courier?.id,
              label: `${task?.courier?.employee.first_name} ${task?.courier?.employee.last_name}`,
            }
          : undefined,
        cars: taskCars,
        date: task.date,
        delivery_number: task.delivery?.delivery_number,
        delivery_status: task.delivery?.delivery_status,
        notes: task.description,
        start_time: removeSeconds(task.start_time),
        start_time_hours1: "1",
        start_time_hours2: "2",
        start_time_minutes1: "0",
        start_time_minutes2: "0",
        end_time: removeSeconds(task.end_time),
        end_time_hours1: "1",
        end_time_hours2: "6",
        end_time_minutes1: "0",
        end_time_minutes2: "0",
        materials: {
          "Kleiderbox groß": task.materials?.["Kleiderbox groß"] ?? 0,
          "Kleiderbox klein": task.materials?.["Kleiderbox klein"] ?? 0,
          Halteverbotszone: task.materials?.["Halteverbotszone"] ?? 0,
          Bücherkarton: task.materials?.["Bücherkarton"] ?? 0,
          Plastikbox: task.materials?.["Plastikbox"] ?? 0,
          Klebeband: task.materials?.["Klebeband"] ?? 0,
          Kreppband: task.materials?.["Kreppband"] ?? 0,
          "Vorsicht Glas Klebeband":
            task.materials?.["Vorsicht Glas Klebeband"] ?? 0,
          "Rolle Luftpolsterfolie": task.materials?.["Rolle Luftpolsterfolie"] ?? 0,
          Werkzeugkoffer: task.materials?.["Werkzeugkoffer"] ?? 0,
        },
      }
    : {
        start_address: offer?.start_address,
        end_address: offer?.end_address,
        price: offer?.price,
        customer_name: `${offer?.customer.first_name} ${offer?.customer.last_name}`,
        cars: undefined,
        courier_id: undefined,
        date: offer?.start_date,
        delivery_number: offer?.delivery_number,
        delivery_status: offer?.delivery_status,
        notes: offer?.notes,
        start_time: "00:00",
        start_time_hours1: "0",
        start_time_hours2: "0",
        start_time_minutes1: "0",
        start_time_minutes2: "0",
        end_time: "00:00",
        end_time_hours1: "0",
        end_time_hours2: "0",
        end_time_minutes1: "0",
        end_time_minutes2: "0",
        materials: {
          "Kleiderbox groß": 0,
          "Kleiderbox klein": 0,
          Halteverbotszone: 0,
          Bücherkarton: 0,
          Plastikbox: 0,
          Klebeband: 0,
          Kreppband: 0,
          "Vorsicht Glas Klebeband": 0,
          "Rolle Luftpolsterfolie": 0,
          Werkzeugkoffer: 0,
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

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (data.delivery_status?.value) {
      data.delivery_status = data.delivery_status?.value
    }
    data.cars = data.cars?.map((car: any) => car.value ?? car)
    if (data.courier_id) {
      data.courier_id = data.courier_id.value
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

    const startTime = moment(data.start_time, "HH:mm")
    const endTime = moment(data.end_time, "HH:mm")

    if (task) {
      if (isExternalItems) {
        setIsModalOpen && setIsModalOpen(false)
        return
      }

      for (const offerTask of offerTasks || []) {
        await dispatch(
          editTask({
            id: offerTask.id,
            data: {
              ...(offerTask.id === task.id ? { courier_id: data.courier_id } : {}),
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
      if (offer) {
        if (endTime.isAfter(startTime)) {
          if (isSendPdf && pdfFile) {
            await API.loadPdfForTask(offer.delivery_number, pdfFile)
          }

          const startDate = moment(offer.start_date)
          const endDate = moment(offer.end_date)

          const addTaskPromises = []

          for (
            let currentDate = startDate.clone();
            currentDate.isSameOrBefore(endDate);
            currentDate.add(1, "day")
          ) {
            addTaskPromises.push(
              ...data.couriers.map((id: { value: number; label: number }) => {
                const currentFormattedDate = currentDate.format("YYYY-MM-DD")
                return dispatch(
                  addTask({
                    courier_id: id.value,
                    delivery_id: offer.id,
                    car: data.cars,
                    title: data.delivery_number,
                    description: data.notes || "Notizen",
                    date: currentFormattedDate,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    is_active: true,
                    is_done: false,
                    materials: data.materials,
                  })
                )
              })
            )
          }

          try {
            const addTaskResults = await Promise.all(addTaskPromises)
            const allTasksAddedSuccessfully = addTaskResults.every(
              (result) => result.meta.requestStatus !== "rejected"
            )

            if (allTasksAddedSuccessfully) {
              await dispatch(
                editOffer({
                  id: offer.id,
                  data: { delivery_status: "ASSIGNED" },
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
    const date = task ? task.date : "" || offer?.start_date

    const response = await API.getTasks(`date_after=${date}&date_before=${date}`)
    setDayTasks(response.results)
  }

  useEffect(() => {
    if (customers.length === 0) getAllLeads(setCustomers)
    if (couriers.length === 0) dispatch(getCouriers())
    getDayTasks()
    getDayVacations(task?.date || offer!.start_date, setVacations)
  }, [])

  if (customers.length === 0 || couriers.length === 0) return <div>Laden...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.offerOverview}>
      <div className={styles.header}>
        <h1>Angebote übersicht</h1>
      </div>

      <div className={styles.main}>
        <TaskInputs
          task={task}
          offer={offer}
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
        <PdfButtons<TaskOverviewFieldsType>
          task={task}
          register={register}
          errors={errors}
          watchPdfFile={watchPdfFile}
          pdfFileRegisterName="pdf_file"
        />

        <SubmitButton />
      </div>

      {(!!task?.delivery?.additional_documents.length ||
        !!offer?.additional_documents.length) && (
        <AdditionalPdfButtons
          offer={task?.delivery || offer || null}
          contract={null}
        />
      )}
    </form>
  )
}

export default OfferTaskOverview
