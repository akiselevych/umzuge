import { FC, useEffect, useState } from "react"
import styles from "./Events.module.scss"
import "styles/index.scss"
import plusIcon from "assets/icons/plus.svg"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { getEvents } from "reduxFolder/slices/Table.slice"
import { serverDomain } from "services/API"
import ModalWindow from "components/ModalWindow/ModalWindow"
import AddEvent from "./AddEvent/AddEvent"
import defaultImage from "assets/images/default-event.png"
import Notification from "components/Notification/Notification"
import classNames from "classnames"
import moment from "moment"

const Events: FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector((state: RootStateType) => state.User.user)
  const events = useSelector((state: RootStateType) => state.Table.events)

  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false)

  useEffect(() => {
    dispatch(getEvents())
  }, [])

  function formatHHmm(time: string) {
    return time.split(":").slice(0, 2).join(":")
  }

  const Events = events.map((e, i) => (
    <div key={i} className={styles.event}>
      <img
        src={e.image_path ? serverDomain + e.image_path : defaultImage}
        alt="event"
      />
      <div className={styles.content}>
        <h4>{e.name}</h4>
        <div className={styles.description}>{e.description}</div>
        <div className={styles.date}>
          {moment(e.date).format("DD-MM-YYYY")}{" "}
          {e.start_time &&
            `| ${formatHHmm(e.start_time)} - ${formatHHmm(e.end_time as string)}`}
        </div>
      </div>
    </div>
  ))

  return (
    <>
      <div className={styles.events}>
        <header className={styles.header}>
          <h2 className="modalTitle">Veranstaltungen</h2>
          {user?.role === "admin" && (
            <button onClick={() => setIsAddEventOpen(true)}>
              <img src={plusIcon} alt="add" />
            </button>
          )}
        </header>

        <main className={styles.main}>{Events}</main>
      </div>

      <div className={styles.notification}>
        <Notification
          text="Ereignis wurde erstellt!"
          isVisible={isNotifivationVisible}
          setIsvisible={setIsNotifivationVisible}
        />
      </div>

      <ModalWindow
        isModaltOpen={isAddEventOpen}
        setIsModaltOpen={setIsAddEventOpen}
        size="small"
        withLogo
      >
        <AddEvent
          setIsAddEventOpen={setIsAddEventOpen}
          setIsNotifivationVisible={setIsNotifivationVisible}
        />
      </ModalWindow>
    </>
  )
}

export default Events
