import { FC, useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useDispatch, useSelector } from "react-redux"
import { API } from "services/API"
import { AppDispatch, RootStateType } from "types"
import { IOffer } from "types/offers"
import CarCell from "./ItemsToSelect/CarCell"
import CourierCell from "./ItemsToSelect/CourierCell"
import Offer from "./Offer/Offer"
import styles from "./OffersDayCalendar.module.scss"
import offerStyles from "./Offer/Offer.module.scss"
import { ITask, IVacation } from "types/calendar"
import Task from "./Offer/Task"
import { getCompanies } from "reduxFolder/slices/Table.slice"
import { IContract } from "types/tables"
import { getDayVacations } from "../EmployeeDayCalendar/CalendarTable"

export const DnDItemTypes = {
  COURIER: "COURIER",
  CAR: "CAR",
}

const OffersDayCalendar: FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )

  const [contracts, setContracts] = useState<IContract[] | null>(null)
  const [offers, setOffers] = useState<IOffer[] | null>(null)
  const [tasks, setTasks] = useState<ITask[] | null>(null)

  const [vacations, setVacations] = useState<IVacation[] | null>(null)

  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const couriers = useSelector((state: RootStateType) => state.Table.couriers)
  const [unavailableCouriers, setUnavailableCouriers] = useState<number[]>([])
  const availableCouriers = couriers.filter(
    (courier) => !unavailableCouriers.includes(+courier.id)
  )
  useEffect(() => {
    const startUnavailableCouriers = couriers
      .filter(
        (c) =>
          tasks?.some((t) => t.courier?.id === c.id) ||
          vacations?.some((v) => v.employee.id === c.employee.id)
      )
      .map((c) => +c.id)
    setUnavailableCouriers(startUnavailableCouriers)
  }, [tasks, couriers, vacations])

  const cars = useSelector((state: RootStateType) => state.Table.cars)
  const [unavailableCars, setUnavailableCars] = useState<number[]>([])
  const availableCars = cars.filter((car) => !unavailableCars.includes(+car.id))
  useEffect(() => {
    const startUnavailableCars = cars
      .map((c) => +c.id)
      .filter((id) => tasks?.some((t) => t.car.some((c) => +c.id === id)))
    setUnavailableCars(startUnavailableCars)
  }, [tasks, couriers])

  async function getOffers() {
    const response = await API.getOffers(
      `delivery_status=ARRANGED&start_date_after=${currentDate}&start_date_before=${currentDate}`
    )
    setOffers(response.results)
  }
  async function getContracts() {
    const response = await API.getContracts(
      `status=ARRANGED&date_after=${currentDate}&date_before=${currentDate}`
    )
    setContracts(response.results)
  }
  async function getTasks() {
    const response = await API.getTasks(
      `date_after=${currentDate}&date_before=${currentDate}`
    )
    setTasks(response.results)
  }
  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      getOffers(),
      getContracts(),
      getTasks(),
      getDayVacations(currentDate, setVacations),
    ])
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        throw error
      })

    setShouldUpdate(false)
  }, [currentDate, shouldUpdate])
  useEffect(() => {
    dispatch(getCompanies())
  }, [])

  const [materialsOpen, setMaterialsOpen] = useState<number | null>(null)
  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest(`.${offerStyles.materials}`)) {
      setMaterialsOpen(null)
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  if (!offers) return <div className={styles.loading}>Laden...</div>

  const Offers = offers.map((offer) => (
    <Offer
      key={offer.id}
      offer={offer}
      offerMaterialsOpen={materialsOpen}
      setOfferMaterialsOpen={setMaterialsOpen}
      setUnavailableCouriers={setUnavailableCouriers}
      setUnavailableCars={setUnavailableCars}
      setShouldUpdate={setShouldUpdate}
    />
  ))
  const Contracts = contracts?.map((contract) => (
    <Offer
      key={contract.id}
      offer={contract as any}
      offerMaterialsOpen={materialsOpen}
      setOfferMaterialsOpen={setMaterialsOpen}
      setUnavailableCouriers={setUnavailableCouriers}
      setUnavailableCars={setUnavailableCars}
      setShouldUpdate={setShouldUpdate}
      isContract
    />
  ))
  const taskGroups: Record<string, ITask[]> = tasks?.reduce((groups, task) => {
    const deliveryNumber = task.delivery
      ? task.delivery.delivery_number
      : task.contract?.firm
    if (!groups[deliveryNumber!]) {
      groups[deliveryNumber!] = []
    }
    groups[deliveryNumber!].push(task)
    return groups
  }, {} as any)

  const Tasks = Object.entries(taskGroups || {}).map(([_, tasksGroup]) => {
    const task = tasksGroup[0]
    const couriers = tasksGroup.map((t) => t.courier)
    const external_workers = tasksGroup.map((t) => t.external_workers)
    return (
      <Task
        key={task.id}
        task={task}
        couriers={couriers as any}
        external_workers={external_workers}
        taskMaterialsOpen={materialsOpen}
        setTaskMaterialsOpen={setMaterialsOpen}
        tasksGroup={tasksGroup}
        getTasks={getTasks}
        setUnavailableCouriers={setUnavailableCouriers}
        setUnavailableCars={setUnavailableCars}
      />
    )
  })

  const Couriers = availableCouriers.map((courier) => (
    <CourierCell key={courier.id} courier={courier} />
  ))
  const Cars = availableCars.map((car) => <CarCell key={car.id} car={car} />)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.dayCalendar}>
        <div className={styles.offers}>
          {isLoading ? (
            <div className={styles.loading}>Laden...</div>
          ) : (
            !offers?.length &&
            !tasks?.length &&
            !contracts?.length && (
              <div className={styles.noOffers}>Keine Angebote</div>
            )
          )}
          {Offers}
          {Contracts}
          {Tasks}
        </div>

        <div className={styles.selectItems}>
          <div className={styles.couriers}>
            <h2 className={styles.title}>Freie Mitarbeiter</h2>
            <div className={styles.selectItem}>
              {tasks ? (
                <>
                  <CourierCell courier="external" />
                  {Couriers}
                </>
              ) : (
                "Laden..."
              )}
            </div>
          </div>
          <div className={styles.cars}>
            <h2 className={styles.title}>Freie LKW</h2>
            <div className={styles.selectItem}>
              {tasks ? (
                <>
                  <CarCell car="external" />
                  {Cars}
                </>
              ) : (
                "Laden..."
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default OffersDayCalendar
