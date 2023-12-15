import classNames from "classnames"
import { FC, useState } from "react"
import styles from "./InputMUI.module.scss"
import showIcon from "assets/icons/visible.png"
import hideIcon from "assets/icons/hide.png"

type PropsType = {
  label: string
  name: string
  borderColor?: string
  type: string
  register: any
  required?: boolean
  watchFields: any
  autoFocus?: boolean
  handleKeyDown?: (e: any) => void
  disabled?: boolean
  fieldErrors?: any
}

const InputMUI: FC<PropsType> = ({
  label,
  name,
  borderColor,
  type,
  register,
  required,
  watchFields,
  autoFocus,
  handleKeyDown,
  disabled,
  fieldErrors,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const inputBorderColorStyles = {
    borderColor: borderColor,
  }

  const labelColorStyles = {
    color: borderColor,
  }

  const [isPassworType, setIsPasswordType] = useState(true)

  return (
    <div
      className={
        (watchFields[name] !== undefined &&
          watchFields[name] !== null &&
          watchFields[name].length !== 0) ||
        isFocused ||
        type === "date"
          ? classNames(
              styles.inputWrapper,
              styles.active,
              fieldErrors && styles.error
            )
          : classNames(styles.inputWrapper, fieldErrors && styles.error)
      }
    >
      <input
        type={type !== "password" ? type : isPassworType ? "password" : "text"}
        style={isFocused ? inputBorderColorStyles : undefined}
        onFocus={handleFocus}
        {...register(name, { required: required })}
        className={styles.input}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
				step="any"
      />
      {type === "password" && (
        <img
          src={isPassworType ? showIcon : hideIcon}
          onClick={() => setIsPasswordType((prev) => !prev)}
          className={styles.passwordVisibility}
        />
      )}
      <label
        className={styles.inputLabel}
        style={isFocused ? labelColorStyles : undefined}
      >
        {label}
      </label>
    </div>
  )
}

export default InputMUI
