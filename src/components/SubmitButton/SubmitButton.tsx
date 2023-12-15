import { FC } from "react"
import styles from "./SubmitButton.module.scss"

type PropsType = {
  isDisabled?: boolean
  handleClick?: () => void
  isAlignRight?: boolean
  text?: string
}

const SubmitButton: FC<PropsType> = ({
  isDisabled,
  handleClick,
  isAlignRight,
  text,
}) => {
  return (
    <button
      type="submit"
      className={styles.submitButton}
      disabled={isDisabled}
      onClick={handleClick}
      style={{ alignSelf: isAlignRight ? "flex-end" : "none" }}
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M20.0116 9.49719L20.9696 8.54797C21.4443 8.07336 21.4618 7.5548 21.0312 7.11535L20.6884 6.76379C20.2577 6.33312 19.7216 6.37707 19.2558 6.84289L18.2978 7.78332L20.0116 9.49719ZM9.24504 20.2462L19.1679 10.3234L17.4628 8.62707L7.53996 18.5323L6.67863 20.6066C6.58195 20.8702 6.85441 21.1603 7.11808 21.0636L9.24504 20.2462Z"
          fill="#00538E"
        />
      </svg> */}
      {text ?? "Fertig"}
    </button>
  )
}

export default SubmitButton
