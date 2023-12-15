//types
import { ModalWindowProps } from "types"
//assets
import Logo from "assets/images/Logo.svg"
import CloseButton from "assets/icons/closeIcon.svg"
//styles
import styles from "components/ModalWindow/ModalWindow.module.scss"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import classNames from "classnames"
import ModalWindowHeader from "./ModalWindowHeader"

const ModalWindow: React.FC<ModalWindowProps> = ({
  isModaltOpen,
  onClose,
  setIsModaltOpen,
  children,
  withLogo,
  size,
  removeCloseButton,
}) => {
  useEffect(() => {
    if (isModaltOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isModaltOpen])

  let modalSize
  switch (size) {
    case "large": {
      modalSize = styles.largeModal
      break
    }
    case "medium": {
      modalSize = styles.mediumModal
      break
    }
    case "small": {
      modalSize = styles.smallModal
      break
    }
    case "tiny": {
      modalSize = styles.tinyModal
      break
    }

    default: {
      modalSize = styles.smallModal
      break
    }
  }

  return (
    <>
      {createPortal(
        <div
          className={styles.modalOverlay}
          style={{ display: isModaltOpen ? "flex" : "none" }}
        >
          <div className={classNames(styles.modal, modalSize)}>
            <ModalWindowHeader
              withLogo={withLogo}
              removeCloseButton={removeCloseButton}
              onClose={onClose}
              setIsModaltOpen={setIsModaltOpen}
            />
            <div className={styles.modalMain}>{isModaltOpen && children}</div>
          </div>
        </div>,
        document.getElementById("root") as HTMLDivElement
      )}
    </>
  )
}

export default ModalWindow
