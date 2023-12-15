import { Dispatch, FC, SetStateAction, useEffect } from "react"
import styles from "./Notification.module.scss"
import paperplaneIcon from "assets/icons/paperplane.svg"
import classNames from "classnames"

const Notification: FC<{
  text: string
  image?: string
  isVisible: boolean
  setIsvisible: Dispatch<SetStateAction<boolean>>
}> = ({ text, image, isVisible, setIsvisible }) => {
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsvisible(false)
      }, 1200)
    }
  }, [isVisible])

  return (
    <div
      className={classNames(
        styles.notification,
        isVisible ? styles.visible : styles.hidden
      )}
    >
      <img src={image ? image : paperplaneIcon} />
      <span>{text}</span>
    </div>
  )
}

export default Notification
