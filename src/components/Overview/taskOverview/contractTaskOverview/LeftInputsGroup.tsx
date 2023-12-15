import classNames from "classnames"
import { FC } from "react"
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form"
import styles from "../TaskOverview.module.scss"
import { ITask, ContractTasksFieldsType } from "types/calendar"
import Select from "react-select"
import { selectStyles } from "components/Overview/offerOverview/LeftInputs"

type PropsType = {
  task: ITask | undefined
  errors: FieldErrors<ContractTasksFieldsType>
  register: UseFormRegister<ContractTasksFieldsType>
  watchFields: ContractTasksFieldsType
  carsOptions: any
  defaultCarValue: any
  control: any
  isExternalItems: boolean
}

const LeftInputsGroup: FC<PropsType> = ({
  task,
  errors,
  register,
  watchFields,
  carsOptions,
  defaultCarValue,
  control,
  isExternalItems,
}) => {
  console.log("task:", task)
  const carNames = task?.car.map((car) => car.name || car.type).join(", ")

  return (
    <div className={styles.column}>
      {/* car */}
      <div className={classNames(styles.group, errors.cars && styles.error)}>
        <div className={styles.group}>
          <span className={classNames(styles.span, styles.active)}>{"Car"}</span>
          <Controller
            name="cars"
            control={control}
            render={({ field }) => (
              <Select
                options={carsOptions}
                isDisabled={isExternalItems}
                isMulti
                defaultValue={defaultCarValue}
                placeholder={!isExternalItems ? "Select a car" : ""}
                {...field}
                value={isExternalItems ? [] : field.value}
                styles={selectStyles}
              />
            )}
          />
          <div className={styles.disabledLable}>
            {!isExternalItems
              ? ""
              : task?.car && task.car.length > 0
              ? carNames
              : "Kein Auto"}
          </div>
        </div>
      </div>

      {/* address */}
      <div
        className={classNames(
          styles.group,
          errors.contract?.start_address && styles.error
        )}
      >
        <input
          className={styles.input}
          type="text"
          {...register("contract.start_address", { required: true })}
          disabled
        />
        <span
          className={
            watchFields.contract?.start_address
              ? classNames(styles.span, styles.active)
              : styles.span
          }
        >
          Startadresse
        </span>
      </div>
      <div
        className={classNames(
          styles.group,
          errors.contract?.end_address && styles.error
        )}
      >
        <input
          className={styles.input}
          type="text"
          {...register("contract.end_address", { required: true })}
          disabled
        />
        <span
          className={
            watchFields.contract?.end_address
              ? classNames(styles.span, styles.active)
              : styles.span
          }
        >
          Endadresse
        </span>
      </div>
      {/* notes */}
      <div
        className={
          errors.notes ? classNames(styles.group, styles.error) : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("notes")}
          disabled={isExternalItems}
        />
        <span
          className={
            watchFields.notes ? classNames(styles.span, styles.active) : styles.span
          }
        >
          Notizen
        </span>
      </div>
      {/* external courier note */}
      {task?.external_workers && (
        <div className={styles.group}>
          <input
            className={styles.input}
            value={task?.external_workers?.notes}
            type="text"
            disabled
          />
          <span
            className={classNames(
              styles.span,
              task?.external_workers?.notes?.length && styles.active
            )}
          >
            Externe Notizen
          </span>
        </div>
      )}
    </div>
  )
}

export default LeftInputsGroup
