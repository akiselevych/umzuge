import { FC, useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { IOffer, OfferFieldsType } from "types/offers"
import { DnDItemTypes } from "../OffersDayCalendar"
import styles from "./Offer.module.scss"
import plusIcon from "assets/icons/plus.svg"
import { ICar, ICourier } from "types/tables"
import { useForm } from "react-hook-form"
import Car from "./Car"
import Courier from "./Courier"
import EnterTimePopUp from "components/EnterTimePopUp/EnterTimePopUp"
import checkMarkIcon from "assets/icons/check-mark.svg"
import Materials from "./Materials"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { addExternalWorker, addTask } from "reduxFolder/slices/Calendar.slice"
import { addCar, editContract, editOffer } from "reduxFolder/slices/Table.slice"
import ModalWindow from "components/ModalWindow/ModalWindow"
import ExternalPopUp from "../ItemsToSelect/ExternalPopUp"
import { v1 } from "uuid"
import { ExternalWorkersType } from "types/calendar"
import InputMUI from "components/InputMUI/InputMUI"
import classNames from "classnames"
import { API } from "services/API"

type PropsType = {
  offer: IOffer
  offerMaterialsOpen: number | null
  setShouldUpdate: React.Dispatch<React.SetStateAction<boolean>>
  setOfferMaterialsOpen: React.Dispatch<React.SetStateAction<number | null>>
  setUnavailableCouriers: React.Dispatch<React.SetStateAction<number[]>>
  setUnavailableCars: React.Dispatch<React.SetStateAction<number[]>>
  isContract?: boolean
}

type FieldsType = OfferFieldsType & { pdf_file: FileList | null }

const Offer: FC<PropsType> = ({
  offer,
  setShouldUpdate,
  offerMaterialsOpen,
  setOfferMaterialsOpen,
  setUnavailableCouriers,
  setUnavailableCars,
  isContract,
}) => {
  const defaulValues: FieldsType = {
    couriers: [],
    car: [],
    external_cars: [],
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
    notes: offer.notes || "",
    pdf_file: null,
  }

  const {
    setValue,
    getValues,
    handleSubmit,
    watch,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FieldsType>({
    defaultValues: defaulValues,
  })
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )

  const dispatch = useDispatch<AppDispatch>()
  const [enterTime, setEnterTime] = useState<"start" | "end" | null>(null)

  const watchFields = watch()
  const materials = watch("materials")
  const couriers = watch("couriers")
  const cars = watch("car")
  const externalCars = watch("external_cars")
  const watchPdfFile = watch("pdf_file")
	
  const [isExternalCourierOpen, setIsExternalCourierOpen] = useState(false)
  const [isExternalCarOpen, setIsExternalCarOpen] = useState(false)

  const OfferCouriers = getValues("couriers").map((courier) => (
    <Courier
      key={v1()}
      courier={courier}
      handleClick={() => handleRemoveCourier(courier.id)}
    />
  ))
  const OfferCars = [...cars, ...(externalCars as any)].map((car) => (
    <Car key={v1()} car={car} handleClick={() => handleRemoveCar(car.id)} />
  ))

  const [{ canDrop: canCourierDrop, isOver: isCourierOver }, dropCourierRef] =
    useDrop({
      accept: DnDItemTypes.COURIER,
      drop: (courier: ICourier) => {
        if (!courier.id) {
          setIsExternalCourierOpen(true)
          return
        }

        if (
          offer.delivery_status === "ARRANGED" ||
          (offer as any).status === "ARRANGED"
        ) {
          clearErrors("couriers")
          const couriers = getValues("couriers")
          const isCourierInArray = couriers.every((c) => c.id !== courier.id)
          setValue("couriers", isCourierInArray ? [...couriers, courier] : couriers)
          setUnavailableCouriers((prev) => [...prev, +courier.id])
        }
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

      if (
        offer.delivery_status === "ARRANGED" ||
        (offer as any).status === "ARRANGED"
      ) {
        const cars = getValues("car") || []
        const isCarInArray = cars.every((c) => c.id !== car.id)
        setValue("car", isCarInArray ? [...cars, car] : cars)
        setUnavailableCars((prev) => [...prev, +car.id])
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    if (watchFields.couriers.length > 0) {
      clearErrors("couriers")
    }
  }, [watchFields.couriers])

  async function onSubmit(data: FieldsType) {
    let isError = false
    const startTime = moment(data.start_time, "HH:mm")
    const endTime = moment(data.end_time, "HH:mm")
    if (data.couriers.length === 0) {
      setError("couriers", {
        message: "Couirier is required",
      })
      isError = true
    }
    if (!endTime.isAfter(startTime)) {
      setError("end_time", {
        message: "End time should be after start time",
      })
      isError = true
    }
    if (!data.pdf_file) {
      setError("pdf_file", {
        message: "Pdf file is required",
      })
      isError = true
    }

    if (isError) return

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

    if (isSendPdf && pdfFile) {
      if (offer.delivery_number) {
        await API.loadPdfForTask(offer.delivery_number, pdfFile)
      } else {
        await API.loadPdfForContractTask(offer.id.toString(), pdfFile)
      }
    }

    const startDate = moment(offer.start_date || currentDate)
    const endDate = moment(offer.end_date || currentDate)

    let carIds = data.car.map((c) => c.id)
    if (data.external_cars && data.external_cars?.length !== 0) {
      for (const externalCar of data.external_cars) {
        const carResponse = await dispatch(
          addCar({
            company_id: externalCar.company,
            type: externalCar.type,
            is_external: true,
          })
        )
        carIds.push(carResponse.payload.id)
      }
    }

    const addTaskPromises = []

    for (
      let currentDate = startDate.clone();
      currentDate.isSameOrBefore(endDate);
      currentDate.add(1, "day")
    ) {
      const formattedDate = currentDate.format("YYYY-MM-DD")

      for (const courier of data.couriers) {
        let courierId = null
        let externalWorkerId = null

        if (courier.isExternal && courier.type && courier.company_id) {
          const workerResponse = await dispatch(
            addExternalWorker({
              type: courier.type as ExternalWorkersType,
              company: courier.company_id,
							notes: (courier as any).notes,
            })
          )
          externalWorkerId = workerResponse.payload.id
        } else {
          courierId = courier.id
        }

        addTaskPromises.push(
          dispatch(
            addTask({
              title: offer.delivery_number ?? (offer as any).firm,
              description: data.notes || "Keine Beschreibung angegeben",
              date: formattedDate,
              start_time: data.start_time,
              end_time: data.end_time,
              is_active: true,
              is_done: false,
              materials: data.materials,
              car: carIds,
              ...(isContract
                ? { contract_id: offer.id }
                : { delivery_id: offer.id }),
              ...(externalWorkerId ? { external_workers_id: externalWorkerId } : {}),
              ...(courierId ? { courier_id: courierId } : {}),
            })
          )
        )
      }
    }

    try {
      const addTaskResults = await Promise.all(addTaskPromises)
      const allTasksAddedSuccessfully = addTaskResults.every(
        (result) => result.meta.requestStatus !== "rejected"
      )
      if (allTasksAddedSuccessfully) {
        if (isContract) {
          await dispatch(
            editContract({ id: offer.id, data: { status: "ASSIGNED" } })
          )
        } else {
          await dispatch(
            editOffer({
              id: offer.id,
              data: { ...data, delivery_status: "ASSIGNED" },
            })
          )
        }
      } else {
        console.log("Some tasks were not added successfully")
      }
      setShouldUpdate(true)
    } catch (error) {
      console.log("An error occurred while adding tasks:", error)
    }
  }

  function handleRemoveCar(id: number | string) {
    setValue(
      "car",
      cars.filter((c) => c.id !== id)
    )
    setValue(
      "external_cars",
      externalCars?.filter((c) => c.id !== id)
    )
    setUnavailableCars((prev) => prev.filter((carId) => carId !== id))
  }
  function handleRemoveCourier(id: number | string) {
    setValue(
      "couriers",
      couriers.filter((c) => c.id !== id)
    )
    setUnavailableCouriers((prev) => prev.filter((courierId) => courierId !== id))
  }
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.offer}>
        <button className={styles.submitButton} disabled={isSubmitting}>
          <img src={checkMarkIcon} alt="submit" />
        </button>
        <div className={styles.cell}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Name des Kunden</span>
          </div>
          <div className={styles.propValue}>
            {offer.delivery_number
              ? `${offer.customer.first_name} ${offer.customer.last_name}`
              : (offer as any).customer_name || "-"}
          </div>
        </div>
        {isContract && (
          <div className={styles.cell}>
            <div className={classNames(styles.propName, styles.title)}>
              <span>Firm</span>
              <div className={styles.contractMark}>V</div>
            </div>
            <div className={styles.propValue}>{(offer as any).firm}</div>
          </div>
        )}
        <div className={styles.cell}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>{offer.delivery_number ? "Liefernummer" : "Nummer"}</span>
          </div>
          <div className={styles.propValue}>{offer.delivery_number ?? offer.id}</div>
        </div>
        {/* Addresses */}
        <div className={styles.cell}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Startadresse</span>
          </div>
          <div className={styles.propValue}>{offer.start_address}</div>
        </div>
        <div className={styles.cell}>
          <div className={classNames(styles.propName, styles.title)}>
            <span>Endadresse</span>
          </div>
          <div className={styles.propValue}>{offer.end_address}</div>
        </div>
        {offer.delivery_number && (
          <div className={styles.cell} style={{ width: 170 }}>
            <div className={styles.propName}>Dauer</div>
            <div className={styles.propValue}>
              {moment(offer.start_date).format("DD.MM.YYYY")} -{" "}
              {moment(offer.end_date).format("DD.MM.YYYY")}
            </div>
          </div>
        )}
        {/* time */}
        <div
          className={styles.cell}
          id={styles.enterTime}
          style={errors.end_time ? { border: "1px solid red" } : {}}
        >
          <div className={styles.propName}>Arbeitszeiten</div>
          <div className={styles.propValue}>
            <span className={styles.propValue} onClick={() => setEnterTime("start")}>
              {getValues("start_time")}
            </span>
            <span className={styles.propValue}> - </span>
            <span className={styles.propValue} onClick={() => setEnterTime("end")}>
              {getValues("end_time")}
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
        {/* Add Item */}
        {couriers.length === 0 ? (
          <div
            className={styles.addItem}
            ref={dropCourierRef}
            style={{
              borderColor:
                canCourierDrop && isCourierOver && couriers.length === 0
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
            ref={couriers.length > 0 ? dropCourierRef : undefined}
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                getValues("couriers").length / 2
              )}, 1fr)`,
              border:
                canCourierDrop && isCourierOver && couriers.length !== 0
                  ? "2px dashed var(--blue, #00538E)"
                  : "none",
            }}
          >
            {OfferCouriers}
          </div>
        )}
        {cars.length === 0 && externalCars?.length === 0 ? (
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
            ref={
              cars.length > 0 || externalCars!.length > 0 ? dropCarRef : undefined
            }
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                (watchFields.car.length + watchFields.external_cars!.length) / 2
              )}, 1fr)`,
              border:
                canCarDrop &&
                isCarOver &&
                (cars.length !== 0 || externalCars!.length > 0)
                  ? "2px dashed var(--blue, #00538E)"
                  : "none",
            }}
          >
            {OfferCars}
          </div>
        )}

        <div
          className={classNames(styles.addFile, styles.cell)}
          style={errors.pdf_file ? { border: "1px solid red" } : {}}
          onClick={() => clearErrors("pdf_file")}
        >
          <label>
            <div className={styles.propName}>Arbeitspapiere</div>
            <input type="file" {...register("pdf_file")} accept=".pdf" />
            <div className={styles.propValue}>
              {(watchPdfFile && (watchPdfFile as any)[0]?.name) || "-"}
            </div>
          </label>
        </div>

        <Materials
          isOpened={offerMaterialsOpen === offer.id}
          handleOpen={() => setOfferMaterialsOpen(offer.id)}
          materials={materials}
          setValue={setValue as any}
        />
        <div className={styles.notes}>
          <InputMUI
            label="Notizen"
            name="notes"
            register={register}
            type="text"
            watchFields={watchFields}
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
          couriers={couriers}
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
          externalCars={externalCars}
          setIsOpen={setIsExternalCarOpen}
          setValue={setValue as any}
        />
      </ModalWindow>
    </>
  )
}

export default Offer
