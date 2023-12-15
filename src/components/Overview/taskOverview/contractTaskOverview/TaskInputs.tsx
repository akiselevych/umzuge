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
import { ICar, IContract, ICourier, ILead } from "types/tables"
import { ITask, ContractTasksFieldsType } from "types/calendar"
import { offerOptionsNames } from "components/TableFilters/TableFilters"
import LeftInputsGroup from "./LeftInputsGroup"
import RightInputsGroup from "./RightInputsGroup"
import { selectStyles } from "../offerTaskOverview/TaskInputs"
import { workerTypeDictionary } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"

type PropsType = {
  task: ITask | undefined
  contract: IContract | undefined
  availableCars: ICar[]
  customers: ILead[]
  availableCouriers: ICourier[]
  errors: FieldErrors<ContractTasksFieldsType>
  control: Control<ContractTasksFieldsType, any>
  register: UseFormRegister<ContractTasksFieldsType>
  watch: UseFormWatch<ContractTasksFieldsType>
  setValue: UseFormSetValue<ContractTasksFieldsType>
  getValues: UseFormGetValues<ContractTasksFieldsType>
  isExternalItems: boolean
}

const TaskInputs: FC<PropsType> = ({
  task,
  contract,
  availableCars,
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
      {/* firm */}
      <div
        className={
          errors.contract?.firm
            ? classNames(styles.group, styles.error)
            : styles.group
        }
      >
        <input
          className={styles.input}
          type="text"
          {...register("contract.firm")}
          disabled
        />
        <span
          className={
            watchFields.contract?.firm
              ? classNames(styles.span, styles.active)
              : styles.span
          }
        >
          Firma
        </span>
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
        <Controller
          name="courier_id"
          control={control}
          rules={{ required: !!contract }}
          render={({ field }) => (
            <Select
              //@ts-ignore
              options={availableCouriersOptions}
              defaultValue={defaultCourierValue as any}
              isDisabled={isExternalItems}
              placeholder={!task && "Courier"}
              isMulti={!task}
              {...field}
              styles={selectStyles}
            />
          )}
        />
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
        control={control}
        isExternalItems={isExternalItems}
      />
    </div>
  )
}

export default TaskInputs
