import { FC, MouseEvent, useEffect, useState } from "react"
import { serverDomain } from "services/API"
import { IInternalCourier } from "types/calendar"
import styles from "./DisositionWorkerCell.module.scss"
import personImage from "assets/images/person.svg"
import { formatHours } from "utils/formatHours"
import classNames from "classnames"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { useDebounce } from "hooks/useDebounce"
import { addBonus, editBonus } from "reduxFolder/slices/Table.slice"
import { useActions } from "hooks/useActions"
import chatIcon from "assets/icons/chat.svg"
import { IEmployee } from "types/tables"
import ModalWindow from "components/ModalWindow/ModalWindow"
import VacationsBarChart from "components/VacationsBarChart/VacationsBarChart"

const InternalCourier: FC<{
  emp: IEmployee
  empInfo?: Partial<IInternalCourier>
  role: "courier" | "sale_man"
  setToUserId?: (id: string) => void
}> = ({ emp, empInfo, role, setToUserId }) => {
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const vacationDataForWorkersTable = useSelector(
    (state: RootStateType) => state.Calendar.vacationDataForWorkersTable
  )

  const specialWorkerDays = vacationDataForWorkersTable
    ? Object.entries(vacationDataForWorkersTable).find((worker) => {
        return worker[0] === emp.id.toString()
      })
    : 0

  const [isVacationsChartOpen, setIsVacationsChartOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const [bonus, setBonus] = useState(empInfo ? empInfo.bonus : 0)
  useEffect(() => {
    setBonus(empInfo?.bonus || 0)
  }, [empInfo?.bonus])

  const [isFirstRender, setIsFirstRender] = useState(true)
  const debouncedBonus = useDebounce(bonus, 1200)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    if (!moment(currentDate).isSame(moment(), "month")) {
      setIsFirstRender(true)
      return
    }

    if (empInfo) {
      dispatch(
        editBonus({
          employee_id: emp.id,
          bonuses: debouncedBonus || "0",
          date: moment().format("YYYY-MM-DD"),
        })
      )
    } else {
      dispatch(
        addBonus({
          employee_id: +emp.id,
          bonuses: debouncedBonus ? +debouncedBonus : 0,
          date: moment().format("YYYY-MM-DD"),
        })
      )
    }
  }, [debouncedBonus])

  const { setCurrentlyOpenedSaleManId } = useActions()

  function handleSaleManClick(e: MouseEvent<HTMLDivElement>) {
    if (
      role !== "sale_man" ||
      (e.target as HTMLDivElement).closest("button")?.id === "chat" ||
      (e.target as HTMLDivElement).closest("input")
    )
      return
    setCurrentlyOpenedSaleManId(`${emp.id}`)
  }

  return (
    <>
      <div className={styles.worker} onClick={handleSaleManClick}>
        <div className={styles.profile}>
          <img
            className={styles.avatar}
            src={emp.image_path ? serverDomain + emp.image_path : personImage}
            alt="avatar"
          />
          <div className={styles.info}>
            <div className={styles.name}>{`${emp.first_name} ${emp.last_name}`}</div>
            {role === "sale_man" && (
              <button
                id="chat"
                onClick={() => setToUserId && setToUserId(`${emp.id}`)}
              >
                <img src={chatIcon} alt="chat" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div
            className={styles.field}
            style={{ cursor: "pointer" }}
            onClick={() => setIsVacationsChartOpen((prev) => !prev)}
          >
            <div className={styles.fieldName}>Urlaubstage</div>
            <div className={styles.fieldValue}>
              {specialWorkerDays ? +specialWorkerDays[1] : 0}
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>Lohn</div>
            <div className={styles.fieldValue}>{emp.const_salary} €</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>Verträge</div>
            <div className={styles.fieldValue}>
              {empInfo ? empInfo.count_offers : 0}
            </div>
          </div>
          <div className={`${styles.group}`} style={{ width: "120px" }}>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              onKeyDown={handleNumberInputChange}
              disabled={!moment(currentDate).isSame(moment(), "month")}
            />
            <span className={classNames(styles.span, bonus !== "" && styles.active)}>
              Boni
            </span>
          </div>
          <div className={styles.workingHours}>
            <div className={styles.week}>
              {formatHours(empInfo?.total_time ? empInfo.total_time : 0)}
            </div>
          </div>
        </div>
      </div>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsVacationsChartOpen}
        isModaltOpen={isVacationsChartOpen}
      >
        <VacationsBarChart workerId={emp.id} />
      </ModalWindow>
    </>
  )
}

export default InternalCourier
