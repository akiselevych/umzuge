import classNames from "classnames"
import { selectStyles } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"
import { RolesDict } from "components/TableFilters/EmployeesTableFilters"
import { FC } from "react"
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form"
import Select from "react-select"
import EmployeeInput from "./EmployeeInput"
import { EmployeeInputsType } from "./EmployeeOverview"
import styles from "./EmployeeOverview.module.scss"

const AddNewEmployeeInputs: FC<{
  register: UseFormRegister<EmployeeInputsType>
  errors: FieldErrors<EmployeeInputsType>
  watchFields: EmployeeInputsType
  control: Control<EmployeeInputsType>
}> = ({ register, errors, watchFields, control }) => {
  const roleOptions = Object.keys(RolesDict).map((n) => ({
    value: n,
    label: RolesDict[n as keyof typeof RolesDict],
  }))
  const defaultRoleValue = roleOptions[0]

  return (
    <>
      <EmployeeInput
        errors={errors}
        name="first_name"
        register={register}
        registerValue="first_name"
        watchFields={watchFields}
        title="Vorname"
      />
      <EmployeeInput
        errors={errors}
        name="last_name"
        register={register}
        registerValue="last_name"
        watchFields={watchFields}
        title="Nachname"
      />

      <div className={classNames(styles.group, styles.roleSelect)}>
        <Controller
          name="role"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              options={roleOptions}
              defaultValue={defaultRoleValue}
              placeholder="Auswählen"
              styles={selectStyles}
            />
          )}
        />
        <span className={classNames(styles.span, styles.active)}>{"Rolle"}</span>
      </div>

      <EmployeeInput
        errors={errors}
        name="password"
        register={register}
        registerValue="password"
        watchFields={watchFields}
        title="Passwort"
      />
    </>
  )
}

export default AddNewEmployeeInputs
