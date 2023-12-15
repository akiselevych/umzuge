import { FC } from "react"
import { ICourier } from "types/tables"
import styles from "./CourierCell.module.scss"
import photo from "assets/images/person.svg"
import { ITask } from "types/calendar"
import { extractDate, extractTime, removeSeconds } from "utils/extractTaskTimePart"
import moment from "moment"
import { IOffer } from "types/offers"
import { serverDomain } from "services/API"
import selectedcheckbox from "assets/icons/selectedCheckbox.svg"
import emptycheckbox from "assets/icons/emptyCheckbox.svg"

type PropsType = {
  courier: ICourier
  currentDay: moment.Moment
  dailyTasks: ITask[]
  handleTaskClick: (offer: IOffer | null) => void
  handleOpenVacationModal: (employeeId: string) => void
  isVacation: boolean
}

const CourierCell: FC<PropsType> = ({
  courier,
  dailyTasks,
  handleTaskClick,
  currentDay,
  handleOpenVacationModal,
  isVacation,
}) => {
  const dailyWorkTime = {
    hours: 0,
    minutes: 0,
  }

  const WorkInfo = dailyTasks.map((t) => {
    getWorkingTime(t.start_time, t.end_time, dailyWorkTime)

    const cars = t.car?.map((c) => c.number).join(", ")

    return (
      <div
        key={t.id}
        className={styles.workInfo}
        onClick={() => handleTaskClick(t.delivery)}
      >
        <div className={styles.cell}>
          <div className={styles.cellName}>Angebot Nummer</div>
          <div className={styles.cellValue}>
            {t.delivery?.delivery_number || t.contract?.firm}
          </div>
        </div>
        <div className={styles.cell}>
          <div className={styles.cellName}>Arbeitszeiten</div>
          <div className={styles.cellValue}>{`${removeSeconds(
            t.start_time
          )} - ${removeSeconds(t.end_time)}`}</div>
        </div>
        <div className={styles.cell}>
          <div className={styles.cellName}>
            <span className={styles.checkBoxContainer}>
              <img
                src={t.is_done ? emptycheckbox : selectedcheckbox}
                className={styles.selectedCheckBox}
                alt="selected checkbox"
              />
              Verfügbar für
            </span>
            neue Angebote
          </div>
        </div>
        <div className={styles.cell}>
          <div className={styles.cellName}>Lkw-Nummer</div>
          <div className={styles.cellValue}>{cars || "-"}</div>
        </div>
      </div>
    )
  })

  function getWorkingTime(start: string, end: string, object: any) {
    const startTime = moment(removeSeconds(start), "HH:mm")
    const endTime = moment(removeSeconds(end), "HH:mm")
    const duration = moment.duration(endTime.diff(startTime))
    object.hours += duration.hours()
    object.minutes += duration.minutes()
  }

  return (
    <div className={styles.courier}>
      <div
        className={styles.profile}
        onClick={() => handleOpenVacationModal(courier.employee.id.toString())}
      >
        <img
          src={
            courier.employee.image_path
              ? `${serverDomain + courier.employee.image_path}`
              : photo
          }
          alt="avatar"
        />
        <div className={styles.profile}>
          <div className={styles.mainInfo}>
            <div className={styles.name}>
              {`${courier.employee.first_name} ${courier.employee.last_name}`}
            </div>
            <div
              className={styles.isAvailable}
              style={{
                backgroundColor:
                  isVacation || dailyTasks.length !== 0 ? "#DA0F0F" : " #009F6A",
              }}
            ></div>
          </div>
          <div className={styles.role}>Kurier</div>
        </div>
      </div>

      <div className={styles.offerInfo}>{WorkInfo}</div>

      <div className={styles.workTime}>
        <div
          className={styles.total}
        >{`${dailyWorkTime.hours}h ${dailyWorkTime.minutes}m`}</div>
      </div>
    </div>
  )
}

export default CourierCell
