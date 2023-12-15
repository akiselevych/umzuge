import { FC, useEffect, useState } from "react"
import styles from "./DisositionWorkerCell.module.scss"
import { IExternalWorker } from "types/calendar"
import personImage from "assets/images/person.svg"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import { useDebounce } from "hooks/useDebounce"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { editExternalWorker } from "reduxFolder/slices/Calendar.slice"
import { formatHours } from "utils/formatHours"
import classNames from "classnames"

type PropsType = {
  worker: IExternalWorker
}

const DisositionWorkerCell: FC<PropsType> = ({ worker }) => {
  const dispatch = useDispatch<AppDispatch>()
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [notes, setNotes] = useState(worker.notes)
  const debouncedNotes = useDebounce(notes, 1200)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    if (!moment(currentDate).isSame(moment(), "month")) {
      setIsFirstRender(true)
      return
    }

    dispatch(
      editExternalWorker({
        id: worker.id,
        notes: debouncedNotes || "",
      })
    )
  }, [debouncedNotes])

  return (
    <div className={styles.worker}>
      <div className={styles.profile}>
        <img className={styles.avatar} src={personImage} alt="avatar" />
        <div className={styles.info}>
          <div className={styles.name}>
            {worker.first_name
              ? `${worker.first_name} ${worker.last_name}`
              : worker.type ?? "Externer Mitarbeiter"}
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.group} style={{ width: "360px" }}>
          <input
            type="text"
            value={notes ?? ""}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!moment(currentDate).isSame(moment(), "month")}
          />
          <span className={classNames(styles.span, notes !== "" && styles.active)}>
            Notizen
          </span>
        </div>

        <div className={styles.workingHours}>
          <div className={styles.week}>{formatHours(worker.total_time ?? 0)}</div>
        </div>
      </div>
    </div>
  )
}

export default DisositionWorkerCell
