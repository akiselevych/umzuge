import { FC } from "react"
import pencilIcon from "assets/icons/pencil.svg"
import styles from "./EditButton.module.scss"

type PropsType = {
	isEditing: boolean
	setIsEditing: (newValue: boolean) => void
	isAlignRight?: boolean
}

const EditButton: FC<PropsType> = ({ isEditing, setIsEditing, isAlignRight }) => {
  return (
    <button
      type="button"
      onClick={() => setIsEditing(!isEditing)}
      className={styles.editButton}
			style={{ alignSelf: isAlignRight ? "flex-end" : "none" }}
    >
      <img src={pencilIcon} alt="edit" />
      Bearbeiten
    </button>
  )
}

export default EditButton
