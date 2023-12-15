import { FC, useState } from "react"
import styles from "../TaskOverview.module.scss"
import classNames from "classnames"
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import Select from "react-select"
import { ICar, ICourier, ILead } from "types/tables"
import { ITask, TasksFieldsType } from "types/calendar"
import LeftInputsGroup from "./LeftInputsGroup"
import RightInputsGroup from "./RightInputsGroup"
import { IOffer } from "types/offers"
import { workerTypeDictionary } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"

type PropsType = {
  task: ITask | undefined
  offer: IOffer | undefined
  availableCars: ICar[]
  customers: ILead[]
  availableCouriers: ICourier[]
  errors: FieldErrors<TasksFieldsType>
  control: Control<TasksFieldsType, any>
  register: UseFormRegister<TasksFieldsType>
  watch: UseFormWatch<TasksFieldsType>
  setValue: UseFormSetValue<TasksFieldsType>
  getValues: UseFormGetValues<TasksFieldsType>
  isExternalItems: boolean
}

export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "2px 4px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
}

const TaskInputs: FC<PropsType> = ({
  task,
  offer,
  availableCars,
  customers,
  availableCouriers,
  errors,
  control,
  register,
  watch,
  getValues,
  setValue,
  isExternalItems,
}) => {
  const watchFields = watch()

  const [timeEnterOpened, setTimeEnterOpened] = useState<"start" | "end" | null>(
    null
  )

  const customersOptions = customers.map((c) => ({
    value: `${c.first_name} ${c.last_name}`,
    label: `${c.first_name} ${c.last_name}`,
  }))
  const defaultCustomerValue = customersOptions.find(
    (t) =>
      t.value ===
      `${task?.delivery?.customer.first_name || offer?.customer.first_name} ${
        task?.delivery?.customer.last_name || offer?.customer.last_name
      }`
  )

  const availableCouriersOptions = availableCouriers.map((c) => ({
    value: c.id,
    label: `${c.employee.first_name} ${c.employee.last_name}`,
  }))
  if (task?.courier) {
    availableCouriersOptions.push({
      value: task?.courier.id,
      label: `${task?.courier.employee.first_name} ${task?.courier.employee.last_name}`,
    })
  }

  const defaultCourierValue = availableCouriersOptions.find(
    (o) => o.value === task?.courier?.id || undefined
  )

  const availableCarsOptions = availableCars.map((c) => ({
    value: c.id,
    label: `${c.name} ${c.number}`,
  }))
  if (!availableCarsOptions.some((c) => task?.car.some((tc) => tc.id === c.value))) {
    for (const c of task?.car || []) {
      availableCarsOptions.push({
        value: c.id,
        label: `${c.name} ${c.number}`,
      })
    }
  }

  const defaultCarValue = availableCarsOptions.filter(
    (c) => task?.car.some((tc) => tc.id === c.value) || undefined
  )

  return (
    <div className={styles.inputs}>
      {/* name */}
      <div
        className={classNames(
          styles.group,
          styles.select,
          errors.customer_name && styles.error
        )}
      >
        <span className={classNames(styles.span, styles.active)}>
          {"Name des Kunden"}
        </span>
        <Controller
          name="customer_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              defaultInputValue={defaultCustomerValue?.value}
              //@ts-ignore
              options={customersOptions}
              isDisabled={true}
              placeholder=""
              {...field}
              styles={selectStyles}
            />
          )}
        />
        <div className={styles.disabledLable}>{defaultCustomerValue?.label}</div>
      </div>
      {/* courier */}
      <div
        className={classNames(
          styles.group,
          styles.select,
          errors.courier_id && styles.error
        )}
      >
        <span className={classNames(styles.span, styles.active)}>
          {"Verbundener Kurier"}
        </span>
        {task ? (
          <Controller
            name="courier_id"
            control={control}
            rules={{ required: !!offer }}
            render={({ field }) => (
              <Select
                options={availableCouriersOptions}
                defaultValue={defaultCourierValue as any}
                isDisabled={isExternalItems}
                isMulti={!task}
                placeholder={!task && "Courier"}
                {...field}
                styles={selectStyles}
              />
            )}
          />
        ) : (
          <Controller
            name="couriers"
            control={control}
            rules={{ required: !!offer }}
            render={({ field }) => (
              <Select
                options={availableCouriersOptions}
                defaultValue={defaultCourierValue as any}
                isDisabled={isExternalItems}
                isMulti
                placeholder={!task && "Courier"}
                {...field}
                styles={selectStyles}
              />
            )}
          />
        )}
        {task?.external_workers && (
          <div className={styles.disabledLable}>
            {task?.external_workers
              ? task.external_workers.first_name
                ? `${task?.external_workers.first_name} ${task?.external_workers.last_name}`
                : workerTypeDictionary[
                    task?.external_workers.type as keyof typeof workerTypeDictionary
                  ]
              : "Kein Technische Mitarbeiter"}
          </div>
        )}
      </div>

      <LeftInputsGroup
        task={task}
        errors={errors}
        register={register}
        watchFields={watchFields}
        carsOptions={availableCarsOptions}
        defaultCarValue={defaultCarValue}
        control={control}
        isExternalItems={isExternalItems}
      />
      <RightInputsGroup
        task={task}
        errors={errors}
        register={register}
        getValues={getValues}
        timeEnterOpened={timeEnterOpened}
        setTimeEnterOpened={setTimeEnterOpened}
        setValue={setValue}
        watch={watch}
        isExternalItems={isExternalItems}
        watchFields={watchFields}
      />
    </div>
  )
}

export default TaskInputs
