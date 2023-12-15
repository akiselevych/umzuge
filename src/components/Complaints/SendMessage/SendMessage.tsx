import { FC, useState } from "react"
import { serverDomain } from "services/API"
import styles from "./SendMessage.module.scss"
import defaultPhoto from "assets/images/person.svg"
import paperPlane from "assets/icons/paperplane.svg"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { sendMessage } from "reduxFolder/slices/User.slice"

type UserType = {
  id: number
  first_name: string
  last_name: string
  role: string
  image?: string
  image_path?: string
}

type PropsType = {
  toUser: UserType
  setIsChatOpened: (value: boolean) => void
  setIsNotifivationVisible: (value: boolean) => void
}

const SendMessage: FC<PropsType> = ({
  toUser,
  setIsChatOpened,
  setIsNotifivationVisible,
}) => {
  const distapch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootStateType) => state.User.user)
  const [message, setMessage] = useState("")

  async function handleSend() {
    if (message !== "" && user) {
      const data = {
        from_user_id: user.id,
        to_user_id: toUser.id.toString(),
        message: message,
      }
      const sendDispatch = await distapch(sendMessage(data))
      if (sendDispatch.meta.requestStatus !== "rejected") {
        setIsChatOpened(false)
        setIsNotifivationVisible(true)
      }
    }
  }

  return (
    <div className={styles.sendMessage}>
      <MessageProfile fromUser={toUser} />
      <div className={styles.send}>
        <input
          type="text"
          placeholder="Nachricht senden"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <button onClick={handleSend}>
          <img src={paperPlane} alt="send" />
        </button>
      </div>
    </div>
  )
}

export default SendMessage

export const MessageProfile: FC<{ fromUser: UserType }> = ({ fromUser }) => (
  <div className={styles.profile}>
    <img
      src={
        fromUser.image ??
        (fromUser.image_path
          ? `${serverDomain}${fromUser.image_path}`
          : defaultPhoto)
      }
      alt="avatar"
    />
    <div className={styles.info}>
      <div
        className={styles.name}
      >{`${fromUser.first_name} ${fromUser.last_name}`}</div>
      <div className={styles.role}>{fromUser.role}</div>
    </div>
  </div>
)
