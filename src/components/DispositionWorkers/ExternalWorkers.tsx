import classNames from "classnames"
import CalendarHeader from "components/Calendar/CalendarHeader/CalendarHeader"
import ExtermalWorker from "components/DisositionWorkerCell/ExtermalWorker"
import moment from "moment"
import { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getExternalWorkersForCompany,
  getExternalWorkersInfoForCompany,
} from "reduxFolder/slices/Calendar.slice"
import { AppDispatch, RootStateType } from "types"
import { IExternalWorker } from "types/calendar"
import styles from "./Workers.module.scss"

const ExternalWorkers: FC<{ companyId: number }> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [workers, setWorkers] = useState<IExternalWorker[] | null>(null)
  const [workersInfo, setWorkersInfo] = useState<IExternalWorker[] | null>(null)

  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const company = useSelector((state: RootStateType) =>
    state.Table.companies.find((c) => c.id === companyId)
  )

  useEffect(() => {
    getWorkers()
  }, [])
  useEffect(() => {
    getWorkersInfo()
  }, [currentDate])

  async function getWorkers() {
    const response = await dispatch(getExternalWorkersForCompany(companyId))
    setWorkers(response.payload)
  }
  async function getWorkersInfo() {
    const response = await dispatch(
      getExternalWorkersInfoForCompany({
        start_date: moment(currentDate).startOf("month").format("YYYY-MM-DD"),
        end_date: moment(currentDate).endOf("month").format("YYYY-MM-DD"),
        company_id: companyId,
      })
    )
    setWorkersInfo(Object.values(response.payload) ?? [])
  }

  if (!workers || !workersInfo) return <div>Loading...</div>

  const Workers = workers?.map((w) => {
    const workerInfo = workersInfo?.find((wi) => wi.id === w.id)
    return <ExtermalWorker key={w.id} worker={{ ...w, ...workerInfo }} />
  })

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className="modalTitle">{`${company?.name} firma arbeiter`}</h1>
      </div>
      <CalendarHeader />
      {workers.length !== 0 ? (
        <div className={classNames(styles.table, styles.externalTable)}>
          {Workers}
        </div>
      ) : (
        <div>No external workers</div>
      )}
    </div>
  )
}

export default ExternalWorkers
