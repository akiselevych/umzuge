import { FC, MouseEventHandler, useRef, useState } from "react"
import styles from "./Message.module.scss"
import { IMessage } from "types/user"
import defaultPhoto from "assets/images/person.svg"
import chatIcon from "assets/icons/chat.svg"
import ModalWindow from "components/ModalWindow/ModalWindow"
import { serverDomain } from "services/API"
import SendMessage from "../SendMessage/SendMessage"
import MessageDetails from "../MessageDetails/MessageDetails"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { markMessageAsRead } from "reduxFolder/slices/User.slice"

type PropsType = {
  message: IMessage
  setIsNotifivationVisible: (value: boolean) => void
}

const Message: FC<PropsType> = ({ message, setIsNotifivationVisible }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isDetailsOpened, setIsDetailsOpened] = useState(false)
  const [isChatOpened, setIsChatOpened] = useState(false)
  const chatButtonRef = useRef(null)
  const chatImgRef = useRef(null)

  const handleOpenDetails: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== chatButtonRef.current && e.target !== chatImgRef.current) {
      if (!message.revised) {
        dispatch(markMessageAsRead(message.id))
      }
      setIsDetailsOpened(true)
    }
  }

  return (
    <>
      <div className={styles.complaint} onClick={handleOpenDetails}>
        <div className={styles.info}>
          <img
            src={
              message.from_user.image_path
                ? `${serverDomain}${message.from_user.image_path}`
                : defaultPhoto
            }
            alt="avatar"
            className={styles.avatar}
          />
          <div className={styles.preview}>
            <div className={styles.head}>
              <div className={styles.name}>
                {`${message.from_user.first_name} ${message.from_user.last_name}`}
              </div>
              <button
                className={styles.chat}
                onClick={() => setIsChatOpened(true)}
                ref={chatButtonRef}
              >
                <img src={chatIcon} alt="chat" ref={chatImgRef} />
              </button>
            </div>
            <div className={styles.message}>{message.title}</div>
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
            id: +message.from_user.id,
            first_name: message.from_user.first_name,
            last_name: message.from_user.last_name,
            image_path: message.from_user.image_path,
						role: message.from_user.role,
          }}
          setIsChatOpened={setIsChatOpened}
          setIsNotifivationVisible={setIsNotifivationVisible}
        />
      </ModalWindow>
      <ModalWindow
        size="small"
        withLogo={false}
        isModaltOpen={isDetailsOpened}
        setIsModaltOpen={setIsDetailsOpened}
      >
        <MessageDetails m={message} />
      </ModalWindow>
    </>
  )
}

export default Message
