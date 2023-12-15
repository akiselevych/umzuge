import classNames from "classnames"
import { FC } from "react"
import styles from "./EmployeeOverview.module.scss"
import { EmployeeInputsType } from "./EmployeeOverview"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import InputMUI from "components/InputMUI/InputMUI"

type PropsType = {
  name: string
  registerValue: string
  errors: FieldErrors<EmployeeInputsType>
  register: UseFormRegister<EmployeeInputsType>
  moreInfoFieldsNames?: any
  title?: string
  watchFields: EmployeeInputsType
}

const EmployeeInput: FC<PropsType> = ({
  name,
  registerValue,
  errors,
  register,
  moreInfoFieldsNames,
  watchFields,
  title,
}) => {
  return (
    <div
      className={
        errors[registerValue as keyof EmployeeInputsType]
          ? classNames(styles.group, styles.error)
          : styles.group
      }
    >
      <div className={styles.group}>
        <input
          className={styles.input}
          type={name !== "date_of_birth" && name !== "date_joined" ? "text" : "date"}
          {...register(name as any, {
            required: name !== "date_of_birth" && name !== "phone" && name !== "bonus",
          })}
          onKeyDown={name.includes("salary") ? handleNumberInputChange : undefined}
        />
        <span
          className={
            watchFields[name as keyof typeof watchFields]
              ? classNames(styles.span, styles.active)
              : styles.span
          }
        >
          {title
            ? title
            : moreInfoFieldsNames[name as keyof typeof moreInfoFieldsNames]}
        </span>
      </div>
    </div>
  )
}

export default EmployeeInput
