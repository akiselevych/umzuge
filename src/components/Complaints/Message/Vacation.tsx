import { FC, MouseEventHandler, useRef, useState } from "react"
import { IVacation } from "types/calendar"
import styles from "./Message.module.scss"
import chatIcon from "assets/icons/chat.svg"
import ModalWindow from "components/ModalWindow/ModalWindow"
import SendMessage from "../SendMessage/SendMessage"
import VacationRequest from "../VacationRequest/VacationRequest"
import defaultPhoto from "assets/images/person.svg"

type PropsType = {
  vacation: IVacation
  setIsNotifivationVisible: (value: boolean) => void
}

const Vacation: FC<PropsType> = ({ vacation, setIsNotifivationVisible }) => {
  const [isDetailsOpened, setIsDetailsOpened] = useState(false)
  const [isChatOpened, setIsChatOpened] = useState(false)
  const chatButtonRef = useRef(null)
  const chatImgRef = useRef(null)

  const handleOpenDetails: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== chatButtonRef.current && e.target !== chatImgRef.current) {
      setIsDetailsOpened(true)
    }
  }

  return (
    <>
      <div className={styles.complaint} onClick={handleOpenDetails}>
        <div className={styles.info}>
          <img
            src={vacation.employee.image || defaultPhoto}
            alt="avatar"
            className={styles.avatar}
          />
          <div className={styles.preview}>
            <div className={styles.head}>
              <div className={styles.name}>
                {`${vacation.employee.first_name} ${vacation.employee.last_name}`}
              </div>
              <button
                className={styles.chat}
                onClick={() => setIsChatOpened(true)}
                ref={chatButtonRef}
              >
                <img src={chatIcon} alt="chat" ref={chatImgRef} />
              </button>
            </div>
            <div className={styles.message}>Urlaubsanfrage</div>
          </div>
        </div>
      </div>

      <ModalWindow
        size="small"
        withLogo={false}
        isModaltOpen={isChatOpened}
        setIsModaltOpen={setIsChatOpened}
      >
        <SendMessage
          toUser={{
            id: vacation.employee.id,
            first_name: vacation.employee.first_name,
            last_name: vacation.employee.last_name,
            role: vacation.employee.role,
            image: vacation.employee.image,
          }}
          setIsChatOpened={setIsChatOpened}
          setIsNotifivationVisible={setIsNotifivationVisible}
        />
      </ModalWindow>
      <ModalWindow
        size="tiny"
        withLogo
        isModaltOpen={isDetailsOpened}
        setIsModaltOpen={setIsDetailsOpened}
      >
        <VacationRequest vacation={vacation} />
      </ModalWindow>
    </>
  )
}

export default Vacation
