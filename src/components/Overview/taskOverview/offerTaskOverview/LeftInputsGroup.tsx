import classNames from "classnames"
import { FC } from "react"
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import styles from "../TaskOverview.module.scss"
import { ITask, TasksFieldsType } from "types/calendar"
import { selectStyles } from "./TaskInputs"
import Select from "react-select"

type PropsType = {
  task: ITask | undefined
  errors: FieldErrors<TasksFieldsType>
  register: UseFormRegister<TasksFieldsType>
  watchFields: any
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
        className={
          errors.start_address
            ? classNames(styles.group, styles.error)
            : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("start_address", { required: true })}
          disabled
        />
        <span className={classNames(styles.span, styles.active)}>Startadresse</span>
      </div>
      <div
        className={
          errors.end_address ? classNames(styles.group, styles.error) : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("end_address", { required: true })}
          disabled
        />
        <span className={classNames(styles.span, styles.active)}>Endadresse</span>
      </div>
      {/* price */}
      <div
        className={
          errors.price ? classNames(styles.group, styles.error) : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("price", { required: true })}
          onKeyDown={handleNumberInputChange}
          disabled
        />
        <span
          className={
            watchFields.price ? classNames(styles.span, styles.active) : styles.span
          }
        >
          Preis
        </span>
      </div>
      {/* delivery number */}
      <div
        className={
          errors.delivery_number
            ? classNames(styles.group, styles.error)
            : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("delivery_number")}
          disabled
        />
        <span
          className={
            watchFields.delivery_number
              ? classNames(styles.span, styles.active)
              : styles.span
          }
        >
          Nummer
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
