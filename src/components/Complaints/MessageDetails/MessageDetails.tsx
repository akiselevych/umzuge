import { FC } from "react"
import { IMessage } from "types/user"
import { MessageProfile } from "../SendMessage/SendMessage"
import styles from "./MessageDetails.module.scss"

const MessageDetails: FC<{ m: IMessage }> = ({ m }) => {
  return (
    <div className={styles.messageDetails}>
      <MessageProfile
        fromUser={{
          id: +m.from_user.id,
          first_name: m.from_user.first_name,
          last_name: m.from_user.last_name,
          role: m.from_user.role,
          image_path: m.from_user.image_path,
        }}
      />
      <div className={styles.mesage}>{m.message}</div>
    </div>
  )
}

export default MessageDetails
