import CalendarHeader from "components/Calendar/CalendarHeader/CalendarHeader"
import SendMessage from "components/Complaints/SendMessage/SendMessage"
import InternalWorker from "components/DisositionWorkerCell/InternalWorker"
import ModalWindow from "components/ModalWindow/ModalWindow"
import moment from "moment"
import { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDispositionlWorkers, getVacationDataForWorkersTable } from "reduxFolder/slices/Calendar.slice"
import { getEmployees } from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import { IInternalSaleMan } from "types/calendar"
import { IEmployee } from "types/tables"
import { IUser } from "types/user"
import styles from "./Workers.module.scss"

const InternalWorkers: FC<{
  setIsNotifivationVisible: (isVisible: boolean) => void
}> = ({ setIsNotifivationVisible }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [couriers, setCouriers] = useState<IEmployee[]>([])
  const [saleMans, setSaleMans] = useState<IEmployee[]>([])

  const internalCurrentWorkerType = useSelector(
    (state: RootStateType) => state.Calendar.internalCurrentWorkerType
  )
  const internalWorkers = useSelector(
    (state: RootStateType) => state.Calendar.internalWorkers
  )

  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )

  async function getCouriers() {
    const data = await dispatch(getEmployees("courier"))
    setCouriers(data.payload)
  }
  async function getSaleMans() {
    const data = await dispatch(getEmployees("sale_man"))
    setSaleMans(data.payload)
  }
  useEffect(() => {
    dispatch(getEmployees())
    dispatch(getVacationDataForWorkersTable({
      end_date: moment().endOf('year').format("YYYY-MM-DD"),
      start_date: moment().startOf('year').format("YYYY-MM-DD"),
    }))
    getCouriers()
    getSaleMans()
  }, [])
  useEffect(() => {
    dispatch(
      getDispositionlWorkers({
        role: internalCurrentWorkerType === "Verkäufer" ? "sale_man" : "courier",
        start_date: moment(currentDate).startOf("month").format("YYYY-MM-DD"),
        end_date: moment(currentDate).endOf("month").format("YYYY-MM-DD"),
      })
    )
  }, [internalCurrentWorkerType, currentDate])

  const [toUserId, setToUserId] = useState<string | null>(null)
  const [toUser, setToUser] = useState<IUser | null>(null)
  const [isChatOpened, setIsChatOpened] = useState(false)

  // Messages
  useEffect(() => {
    if (toUserId) {
      const worker = saleMans.find((c) => c.id == toUserId)
      if (worker) {
        setToUser(worker as any)
        setIsChatOpened(true)
      }
    }

    return () => setToUserId(null)
  }, [toUserId])

  if (
    (internalCurrentWorkerType === "Technische Mitarbeiter" &&
      !internalWorkers.couriers) ||
    (internalCurrentWorkerType === "Verkäufer" && !internalWorkers.sale_mans)
  )
    return <div>Laden...</div>

  const internalCouriers = couriers.map((c) => {
    const info = internalWorkers.couriers?.find((w) => w.id === +c.id)
    return {
      emp: c,
      empInfo: info,
      hasInfo: !!info,
    }
  })
  const sortedCouriers = sortedByHasInfo(internalCouriers)
  const InternalCouriers = sortedCouriers.map((c) => (
    <InternalWorker key={c.emp.id} emp={c.emp} empInfo={c.empInfo} role="courier" />
  ))

  const internalSaleMans = saleMans.map((s) => {
    const info = internalWorkers.sale_mans?.find((w) => w.id === +s.id)
    return {
      emp: s,
      empInfo: info,
      hasInfo: !!info,
    }
  })
  const sortedSaleMans = sortedByHasInfo(internalSaleMans)
  const InternalSaleMans = sortedSaleMans.map((s) => (
    <InternalWorker
      key={s.emp.id}
      emp={s.emp}
      empInfo={s.empInfo}
      role="sale_man"
      setToUserId={setToUserId}
    />
  ))

  const displayWorkers =
    internalCurrentWorkerType === "Technische Mitarbeiter"
      ? InternalCouriers
      : InternalSaleMans

  function sortedByHasInfo(
    array: {
      emp: IEmployee
      empInfo: IInternalSaleMan | undefined
      hasInfo: boolean
    }[]
  ) {
    return array.sort((a, b) => {
      if (a.hasInfo && !b.hasInfo) {
        return -1
      }
      if (!a.hasInfo && b.hasInfo) {
        return 1
      }
      return 0
    })
  }

  return (
    <>
      <div className={styles.screen}>
        <CalendarHeader />
        <div className={styles.table}>{displayWorkers}</div>
      </div>

      <ModalWindow
        size="small"
        withLogo={false}
        isModaltOpen={isChatOpened}
        setIsModaltOpen={setIsChatOpened}
      >
        {toUser && (
          <SendMessage
            setIsNotifivationVisible={setIsNotifivationVisible}
            toUser={{
              id: +toUser.id,
              first_name: toUser.first_name,
              last_name: toUser.last_name,
              role: toUser.role,
              image_path: toUser.image_path,
            }}
            setIsChatOpened={setIsChatOpened}
          />
        )}
      </ModalWindow>
    </>
  )
}

export default InternalWorkers
