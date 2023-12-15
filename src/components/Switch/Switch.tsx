import { FC, useState } from "react"
import "./Switch.scss"

type PropsType = {
  isOn?: boolean
  handleToggle?: () => void
  colorOne: string
  colorTwo: string
  labelRef: any
  checkboxRef: any
  spanRef: any
  register?: any
  setValue?: any
  disabled?: boolean
}

const Switch: FC<PropsType> = ({
  isOn,
  handleToggle,
  colorOne,
  colorTwo,
  labelRef,
  checkboxRef,
  spanRef,
  register,
  setValue,
  disabled,
}) => {
  const [isActive, setIsActive] = useState(false)
  function handleAddingToggle() {
    setValue("is_active", !isActive)
    setIsActive(!isActive)
  }

  if (isOn !== undefined) {
    return (
      <>
        <label
          style={{
            background: isOn ? colorOne : colorTwo,
            opacity: disabled ? 0.4 : 1,
          }}
          className="switch-label"
          ref={labelRef}
        >
          <input
            checked={isOn}
            onChange={handleToggle}
            className="switch-checkbox"
            type="checkbox"
            ref={checkboxRef}
            disabled={disabled}
          />
          <span
            className={isOn ? `switch-button active` : `switch-button`}
            ref={spanRef}
          />
        </label>
      </>
    )
  } else {
    return (
      <>
        <label
          style={{ background: isActive ? colorOne : colorTwo }}
          className="switch-label"
          ref={labelRef}
        >
          <input
            checked={isActive}
            onClick={handleAddingToggle}
            className="switch-checkbox"
            type="checkbox"
            ref={checkboxRef}
            {...register("is_active")}
          />
          <span
            className={isActive ? `switch-button active` : `switch-button`}
            ref={spanRef}
          />
        </label>
      </>
    )
  }
}

export default Switch
