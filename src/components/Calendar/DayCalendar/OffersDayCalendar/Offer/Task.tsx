import { FC, useEffect, useState } from "react"
import styles from "./Offer.module.scss"
import Car from "./Car"
import Materials from "./Materials"
import classNames from "classnames"
import { ExternalWorkersType, ITask, TaskExternalWorkerType } from "types/calendar"
import Courier from "./Courier"
import { v1 } from "uuid"
import { removeSeconds } from "utils/extractTaskTimePart"
import checkMarkIcon from "assets/icons/check-mark.svg"
import pencilIcon from "assets/icons/pencil.svg"
import { ICar, ICourier, IEditContract } from "types/tables"
import InputMUI from "components/InputMUI/InputMUI"
import { useForm } from "react-hook-form"
import moment from "moment"
import DatePicker from "react-datepicker"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import {
  addExternalWorker,
  addTask,
  deleteTask,
  editTask,
} from "reduxFolder/slices/Calendar.slice"
import { OfferFieldsType, OfferFieldsCourierType } from "types/offers"
import { addCar, editContract, editOffer } from "reduxFolder/slices/Table.slice"
import EnterTimePopUp from "components/EnterTimePopUp/EnterTimePopUp"
import { useDrop } from "react-dnd"
import { DnDItemTypes } from "../OffersDayCalendar"
import plusIcon from "assets/icons/plus.svg"
import ModalWindow from "components/ModalWindow/ModalWindow"
import ExternalPopUp from "../ItemsToSelect/ExternalPopUp"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import De from "date-fns/locale/de"

type PropsType = {
  task: ITask
  couriers: Omit<ICourier, "sale_man">[]
  external_workers: TaskExternalWorkerType[]
  taskMaterialsOpen: number | null
  setTaskMaterialsOpen: (id: number | null) => void
  tasksGroup: ITask[]
  getTasks: () => void
  setUnavailableCouriers: React.Dispatch<React.SetStateAction<number[]>>
  setUnavailableCars: React.Dispatch<React.SetStateAction<number[]>>
}

type FieldsType = Omit<OfferFieldsType, "couriers"> & {
  couriers: (
    | Omit<ICourier, "sale_man">
    | TaskExternalWorkerType
    | OfferFieldsCourierType
  )[]
}

const Task: FC<PropsType> = ({
  task,
  couriers,
  external_workers,
  taskMaterialsOpen,
  setTaskMaterialsOpen,
  tasksGroup,
  getTasks,
  setUnavailableCars,
  setUnavailableCouriers,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const notNullCouriers = couriers.filter((c) => c)
  const notNullExternalWorkers = external_workers.filter((w) => w)

  const start_time = removeSeconds(task.start_time)
  const end_time = removeSeconds(task.end_time)
  const dafaultValues: FieldsType = {
    couriers: [...notNullCouriers, ...notNullExternalWorkers],
    car: task.car,
    notes: task.description ?? "",
    materials: {
      "Kleiderbox groß": task.materials?.["Kleiderbox groß"] ?? 0,
      "Kleiderbox klein": task.materials?.["Kleiderbox klein"] ?? 0,
      Halteverbotszone: task.materials?.Halteverbotszone ?? 0,
      Bücherkarton: task.materials?.Bücherkarton ?? 0,
      Plastikbox: task.materials?.Plastikbox ?? 0,
      Klebeband: task.materials?.Klebeband ?? 0,
      Kreppband: task.materials?.Kreppband ?? 0,
      "Vorsicht Glas Klebeband": task.materials?.["Vorsicht Glas Klebeband"] ?? 0,
      "Rolle Luftpolsterfolie": task.materials?.["Rolle Luftpolsterfolie"] ?? 0,
      Werkzeugkoffer: task.materials?.Werkzeugkoffer ?? 0,
    },
    start_time: start_time,
    start_time_hours1: start_time[0],
    start_time_hours2: start_time[1],
    start_time_minutes1: start_time[3],
    start_time_minutes2: start_time[4],
    end_time: end_time,
    end_time_hours1: end_time[0],
    end_time_hours2: end_time[1],
    end_time_minutes1: end_time[3],
    end_time_minutes2: end_time[4],
  }

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: dafaultValues,
  })
  const watchFields = watch()
  const materials = watch("materials")
  const carsWatch = watch("car")
  const couriersWatch = watch("couriers")

  const [isEditing, setIsEditing] = useState(false)
  const [enterTime, setEnterTime] = useState<"start" | "end" | null>(null)

  const [isDatepicherVisible, setIsDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    task.delivery ? task.date : moment(task.contract?.date).format("YYYY-MM-DD")
  )

  const [isExternalCourierOpen, setIsExternalCourierOpen] = useState(false)
  const [isExternalCarOpen, setIsExternalCarOpen] = useState(false)

  useEffect(() => {
    if (watchFields.couriers.length > 0) {
      clearErrors("couriers")
    }
  }, [watchFields.couriers])

  const [{ canDrop: canCourierDrop, isOver: isCourierOver }, dropCourierRef] =
    useDrop({
      accept: DnDItemTypes.COURIER,
      drop: (courier: Omit<ICourier, "sale_man"> | TaskExternalWorkerType) => {
        if (!courier?.id) {
          setIsExternalCourierOpen(true)
          return
        }

        clearErrors("couriers")
        const couriers = getValues("couriers")
        const isCourierInArray = couriers.every((c) => c?.id !== courier.id)
        setValue("couriers", isCourierInArray ? [...couriers, courier] : couriers)
        setUnavailableCouriers((prev) => [...prev, +courier.id])
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    })
  const [{ canDrop: canCarDrop, isOver: isCarOver }, dropCarRef] = useDrop({
    accept: DnDItemTypes.CAR,
    drop: (car: ICar) => {
      if (!car.id) {
        setIsExternalCarOpen(true)
        return
      }

      const cars = getValues("car") || []
      const isCarInArray = cars.every((c) => c.id !== car.id)
      setValue("car", isCarInArray ? [...cars, car] : cars)
      setUnavailableCars((prev) => [...prev, +car.id])
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const Couriers = couriersWatch.map((courier) => (
    <Courier
      key={v1()}
      courier={courier as any}
      disabled={!isEditing}
      handleClick={() => handleRemoveCourier(courier!.id)}
      setUnavailableCouriers={setUnavailableCouriers}
    />
  ))
  const Cars = carsWatch.map((car) => (
    <Car
      key={v1()}
      car={car}
      disabled={!isEditing}
      handleClick={() => handleRemoveCar(car.id)}
    />
  ))

  const startCouriers = [...notNullCouriers, ...notNullExternalWorkers]

  async function subminHandler(data: FieldsType) {
    const startCourierIds = startCouriers.map((c) => c?.id).toString()

    let carIds = data.car.map((c) => c.id)
    for (const car of data.car) {
      if ((car as any).is_external) {
        carIds = carIds.filter((id) => id !== car.id)
        const carResponse = await dispatch(
          addCar({
            company_id: car.company as any,
            type: car.type as any,
            is_external: true,
          })
        )
        carIds.push(carResponse.payload.id)
      }
    }

    let couriersToDelete = startCouriers.map((c) => c?.id.toString())

    if (task.delivery) await handleEditOffer(data)
    if (task.contract) await handleEditContract(data)

    for (const courier of data.couriers) {
      if (courier && startCourierIds.includes(courier.id.toString())) {
        couriersToDelete = couriersToDelete.filter(
          (id) => id !== courier.id.toString()
        )
        const task = tasksGroup.find(
          (t) =>
            t.courier?.id === +courier.id || t.external_workers?.id === +courier.id
        )
        await handleEditTask(data, task, carIds)
      } else {
        await handleAddTask(data, courier, carIds)
      }
    }
    for (const courierId of couriersToDelete) {
      if (!courierId) continue
      const courierTask = tasksGroup.find(
        (t) => t.courier?.id === +courierId || t.external_workers?.id === +courierId
      )
      courierTask && (await dispatch(deleteTask(courierTask.id)))
    }

    setIsEditing(false)
    getTasks()
  }

  async function handleEditTask(
    data: FieldsType,
    task: ITask | undefined,
    carIds: (number | string)[]
  ) {
    if (!task) return
    const result = {
      materials: data.materials,
      date: selectedDate,
      start_time: data.start_time,
      end_time: data.end_time,
      car: carIds,
      description: data.notes || "description",
    }
    await dispatch(editTask({ id: task.id, data: result }))
  }
  async function handleAddTask(
    data: FieldsType,
    courier:
      | Omit<ICourier, "sale_man">
      | TaskExternalWorkerType
      | OfferFieldsCourierType,
    carIds: (number | string)[]
  ) {
    let courierId = null
    let externalWorkerId = null

    if (
      (courier as any)?.isExternal &&
      (courier as any)?.type &&
      (courier as any)?.company_id
    ) {
      const workerResponse = await dispatch(
        addExternalWorker({
          type: (courier as any).type as ExternalWorkersType,
          company: (courier as any).company_id,
          notes: (courier as any).notes,
        })
      )
      externalWorkerId = workerResponse.payload.id
    } else {
      courierId = courier?.id
    }

    const result = {
      car: carIds,
      title: task.delivery?.delivery_number || task.contract?.firm,
      description: data.notes || "description",
      date: selectedDate,
      start_time: data.start_time,
      end_time: data.end_time,
      is_active: true,
      is_done: false,
      materials: data.materials,
      ...(task.delivery ? { delivery_id: task.delivery.id } : {}),
      ...(task.contract ? { contract_id: task.contract.id } : {}),
      ...(externalWorkerId ? { external_workers_id: externalWorkerId } : {}),
      ...(courierId ? { courier_id: courierId } : {}),
    }
    await dispatch(addTask(result))
  }

  async function handleEditOffer(data: FieldsType) {
    if (!task.delivery) return
    const result = {
      delivery_date: selectedDate,
      notes: data.notes,
    }
    await dispatch(editOffer({ id: task.delivery.id, data: result }))
  }
  async function handleEditContract(data: FieldsType) {
    if (!task.contract) return
    const result: Partial<IEditContract> = {
      date: selectedDate,
    }
    await dispatch(editContract({ id: task.contract.id, data: result }))
  }

  function handleDateChange(date: Date | null) {
    setSelectedDate(moment(date).format("YYYY-MM-DD"))
    setIsDatePickerVisible(false)
  }
  function handleEditMode(e: any) {
    e.preventDefault()
    setIsEditing(true)
  }
  function handleRemoveCar(id: number | string) {
    setValue(
      "car",
      carsWatch.filter((c) => c.id !== id)
    )
    setUnavailableCars((prev) => prev.filter((carId) => carId !== id))
  }
  function handleRemoveCourier(id: number | string) {
    setValue(
      "couriers",
      couriersWatch.filter((c) => c?.id !== id)
    )
    setUnavailableCouriers((prev) => prev.filter((courierId) => courierId !== id))
  }

  function loadWorksPapierenPDF() {
    if (task.delivery?.pdf_file) {
      window.open(task.delivery.pdf_file, "_blank")
    } else if (task.contract?.pdf_file) {
      window.open(task.contract.pdf_file, "_blank")
    } else {
      alert("Keine pdf-Datei")
    }
  }

  registerLocale("en-GB", De)
  setDefaultLocale("en-GB")

  return (
    <>
      <form className={styles.offer} onSubmit={handleSubmit(subminHandler)}>
        {isEditing ? (
          <button className={styles.submitButton} disabled={isSubmitting}>
            <img src={checkMarkIcon} />
          </button>
        ) : (
          <button
            className={classNames(
              styles.submitButton,
              (task.delivery
                ? task.delivery.delivery_status !== "ASSIGNED"
                : task.contract?.status !== "ASSIGNED") && styles.hidden
            )}
            type="button"
            onClick={handleEditMode}
          >
            <img src={pencilIcon} style={{ width: 20, height: 20 }} />
          </button>
        )}

        <div className={classNames(styles.cell, styles.disabled)}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Name des Kunden</span>
          </div>
          <div className={styles.propValue}>
            {task.delivery?.delivery_number
              ? `${task.delivery?.customer.first_name} ${task.delivery?.customer.last_name}`
              : task.contract?.customer_name || "-"}
          </div>
        </div>
        {task.contract && (
          <div className={classNames(styles.cell, styles.disabled)}>
            <div className={classNames(styles.propName, styles.title)}>
              <span>Firm</span>
              <div className={styles.contractMark}>V</div>
            </div>
            <div className={styles.propValue}>{task.contract.firm}</div>
          </div>
        )}
        <div className={classNames(styles.cell, styles.disabled)}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>{task.delivery?.delivery_number ? "Liefernummer" : "Nummer"}</span>
          </div>
          <div className={styles.propValue}>
            {task.delivery?.delivery_number ?? task.contract?.id}
          </div>
        </div>

        {/* Adresses */}
        <div className={classNames(styles.cell, styles.disabled)}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Startadresse</span>
          </div>
          <div className={styles.propValue}>
            {task.delivery?.start_address || task.contract?.start_address}
          </div>
        </div>
        <div className={classNames(styles.cell, styles.disabled)}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Endadresse</span>
          </div>
          <div className={styles.propValue}>
            {task.delivery?.end_address || task.contract?.end_address}
          </div>
        </div>

        {/* date */}
        <div
          className={classNames(
            styles.cell,
            !isEditing && styles.disabled,
            isDatepicherVisible && styles.pickingDate
          )}
        >
          <div className={styles.propName}>Liefertermin</div>
          <div
            className={styles.propValue}
            onClick={() => setIsDatePickerVisible(true)}
          >
            {moment(selectedDate).format("DD-MM-YYYY")}
          </div>
          <div className={classNames(styles.datePicker, "custom-date-picker")}>
            {isDatepicherVisible && (
              <DatePicker
                selected={new Date(selectedDate)}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                locale="en-GB"
              />
            )}
          </div>
        </div>

        {/* time */}
        <div
          className={classNames(styles.cell, !isEditing && styles.disabled)}
          id={styles.enterTime}
        >
          <div className={styles.propName}>Arbeitszeiten</div>
          <div className={styles.propValue}>
            <span className={styles.propValue} onClick={() => setEnterTime("start")}>
              {watchFields.start_time}
            </span>
            <span className={styles.propValue}> - </span>
            <span className={styles.propValue} onClick={() => setEnterTime("end")}>
              {watchFields.end_time}
            </span>
            <EnterTimePopUp
              timeType={enterTime === "start" ? "start" : "end"}
              opened={enterTime}
              setOpened={setEnterTime}
              register={register}
              getValues={getValues}
              setValue={setValue}
              watch={watch}
              clearErrors={clearErrors}
              fields={
                enterTime === "start"
                  ? {
                      neededTime: "start_time",
                      hours1: "start_time_hours1",
                      hours2: "start_time_hours2",
                      minutes1: "start_time_minutes1",
                      minutes2: "start_time_minutes2",
                    }
                  : {
                      neededTime: "end_time",
                      hours1: "end_time_hours1",
                      hours2: "end_time_hours2",
                      minutes1: "end_time_minutes1",
                      minutes2: "end_time_minutes2",
                    }
              }
            />
          </div>
        </div>

        {couriersWatch.length === 0 && isEditing ? (
          <div
            className={styles.addItem}
            ref={dropCourierRef}
            style={{
              borderColor:
                canCourierDrop && isCourierOver && couriersWatch.length === 0
                  ? "var(--blue, #00538E)"
                  : errors.couriers
                  ? "red"
                  : "var(--gray-5, #E0E0E0)",
            }}
          >
            <span>Einen technische Mitarbeiter hinzufügen</span>{" "}
            <div className={styles.plus}>
              <img src={plusIcon} alt="add" />
            </div>
          </div>
        ) : (
          <div
            className={styles.couriers}
            ref={couriersWatch.length > 0 && isEditing ? dropCourierRef : undefined}
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                couriersWatch.length / 2
              )}, 1fr)`,
              border:
                canCourierDrop && isCourierOver && couriersWatch.length !== 0
                  ? "2px dashed var(--blue, #00538E)"
                  : "none",
            }}
          >
            {Couriers.length === 0 && "Keine technischen Mitarbeiter"}
            {Couriers}
          </div>
        )}

        {carsWatch.length === 0 && isEditing ? (
          <div
            className={styles.addItem}
            ref={dropCarRef}
            style={{
              borderColor:
                canCarDrop && isCarOver
                  ? "var(--blue, #00538E)"
                  : errors.car
                  ? "red"
                  : "var(--gray-5, #E0E0E0)",
            }}
          >
            <span>Einen Lkw hinzufügen</span>{" "}
            <div className={styles.plus}>
              <img src={plusIcon} alt="add" />
            </div>
          </div>
        ) : (
          <div
            className={styles.couriers}
            ref={carsWatch.length > 0 && isEditing ? dropCarRef : undefined}
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(carsWatch.length / 2)}, 1fr)`,
              border:
                canCarDrop && isCarOver && carsWatch.length !== 0
                  ? "2px dashed var(--blue, #00538E)"
                  : "none",
            }}
          >
            {Cars.length === 0 && <div className={styles.noItem}>Keine LKW</div>}
            {Cars}
          </div>
        )}

        <div className={classNames(styles.addFile, styles.cell)}>
          <div className={styles.propName}>Arbeitspapiere</div>
          <button
            type="button"
            className={styles.pdfButton}
            onClick={loadWorksPapierenPDF}
          >
            {task.delivery?.pdf_file
              ? task.delivery.pdf_file.split("/").slice(-1)
              : (task.contract?.pdf_file ?? "-").split("/").slice(-1)}
          </button>
        </div>

        <Materials
          isOpened={taskMaterialsOpen === task.id}
          handleOpen={() => setTaskMaterialsOpen(task.id)}
          materials={materials}
          disabled={!isEditing}
          setValue={setValue as any}
        />

        <div className={styles.notes}>
          <InputMUI
            label="Notizen"
            name="notes"
            register={register}
            type="text"
            watchFields={watchFields}
            disabled={!isEditing}
          />
        </div>
      </form>

      <ModalWindow
        isModaltOpen={isExternalCourierOpen}
        setIsModaltOpen={setIsExternalCourierOpen}
        size="tiny"
        withLogo
      >
        <ExternalPopUp
          type="worker"
          setIsOpen={setIsExternalCourierOpen}
          couriers={couriersWatch as any}
          setValue={setValue as any}
        />
      </ModalWindow>
      <ModalWindow
        isModaltOpen={isExternalCarOpen}
        setIsModaltOpen={setIsExternalCarOpen}
        size="tiny"
        withLogo
      >
        <ExternalPopUp
          type="car"
          setIsOpen={setIsExternalCarOpen}
          externalCars={carsWatch as any}
          setValue={setValue as any}
          isTask
        />
      </ModalWindow>
    </>
  )
}

export default Task
