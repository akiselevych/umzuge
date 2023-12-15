import { FC, useEffect, useState } from "react"
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import { FormValues } from "./ContractOverview"
import InputMUI from "components/InputMUI/InputMUI"
import { contractFields } from "components/Tables/Contracts/ContractsTable"
import WorkersInfoTable from "./InputTables/WorkersInfoTable"
import CarsInfoTable from "./InputTables/CarsInfoTable"
import ModalTableField from "./ModalTableField"
import styles from "./ContractOverview.module.scss"
import classNames from "classnames"
import EnterTimePopUp from "components/EnterTimePopUp/EnterTimePopUp"

type PropsType = {
  property: keyof FormValues
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
  watch: UseFormWatch<FormValues>
  getValues: UseFormGetValues<FormValues>
  setValue: UseFormSetValue<FormValues>
  timeEnterOpened: "start" | "end" | null
  setTimeEnterOpened: React.Dispatch<React.SetStateAction<"start" | "end" | null>>
}

const InputField: FC<PropsType> = ({
  property,
  register,
  errors,
  setValue,
  timeEnterOpened,
  setTimeEnterOpened,
  getValues,
  watch,
}) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const watchFields = watch()

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [isInfoModalOpen])

  if (property === "workers_info") {
    return (
      <ModalTableField
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        name="Arbeiterinformationen"
      >
        <WorkersInfoTable
          workersInfo={watchFields.workers_info}
          setValue={setValue}
        />
      </ModalTableField>
    )
  } else if (property === "cars_info") {
    return (
      <ModalTableField
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        name="LKW Informationen"
      >
        <CarsInfoTable carsInfo={watchFields.cars_info} setValue={setValue} />
      </ModalTableField>
    )
  } else if (property === "start_time") {
    return (
      <div className={styles.group}>
        <div
          onClick={() => setTimeEnterOpened("start")}
          className={classNames(styles.timeInput, errors.start_time && styles.error)}
        >
          <div className={styles.empty}></div>
          <span className={classNames(styles.span, styles.active)}>
            {"Anfangszeit"}
          </span>
          <input
            type="text"
            className={styles.input}
            {...register("start_time")}
            placeholder="00:00"
            disabled
          />
        </div>
        <EnterTimePopUp
          timeType="start"
          opened={timeEnterOpened}
          setOpened={setTimeEnterOpened}
          register={register}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          fields={{
            neededTime: "start_time",
            hours1: "start_time_hours1",
            hours2: "start_time_hours2",
            minutes1: "start_time_minutes1",
            minutes2: "start_time_minutes2",
          }}
        />
      </div>
    )
  } else if (property === "end_time") {
    return (
      <div className={styles.group}>
        <div
          onClick={() => setTimeEnterOpened("end")}
          className={classNames(styles.timeInput, errors.end_time && styles.error)}
        >
          <div className={styles.empty}></div>
          <span className={classNames(styles.span, styles.active)}>{"Endzeit"}</span>
          <input
            type="text"
            className={styles.input}
            {...register("end_time")}
            placeholder="00:00"
            disabled
          />
        </div>
        <EnterTimePopUp
          timeType="end"
          opened={timeEnterOpened}
          setOpened={setTimeEnterOpened}
          register={register}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          fields={{
            neededTime: "end_time",
            hours1: "end_time_hours1",
            hours2: "end_time_hours2",
            minutes1: "end_time_minutes1",
            minutes2: "end_time_minutes2",
          }}
        />
      </div>
    )
  }

  return (
    <InputMUI
      label={contractFields[property as keyof typeof contractFields] || ""}
      name={property}
      register={register}
      watchFields={watchFields}
      type={property === "date" ? "date" : "text"}
      fieldErrors={errors[property as keyof typeof errors]}
      required
    />
  )
}

export default InputField
