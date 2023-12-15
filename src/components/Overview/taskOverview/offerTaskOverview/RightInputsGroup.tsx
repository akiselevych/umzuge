import classNames from "classnames"
import { FC, useEffect, useState } from "react"
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import { ITask, TasksFieldsType } from "types/calendar"
import EnterTimePopUp from "../../../EnterTimePopUp/EnterTimePopUp"
import styles from "../TaskOverview.module.scss"
import Materials from "../Materials"

type PropsType = {
  task?: ITask
  errors: FieldErrors<TasksFieldsType>
  register: UseFormRegister<TasksFieldsType>
  setValue: UseFormSetValue<TasksFieldsType>
  getValues: UseFormGetValues<TasksFieldsType>
  watch: UseFormWatch<TasksFieldsType>
  timeEnterOpened: "start" | "end" | null
  setTimeEnterOpened: (value: "start" | "end" | null) => void
  isExternalItems: boolean
  watchFields: any
}

const RightInputsGroup: FC<PropsType> = ({
  task,
  errors,
  register,
  watch,
  timeEnterOpened,
  setTimeEnterOpened,
  getValues,
  setValue,
  isExternalItems,
  watchFields,
}) => {
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false)

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest("#materials")) {
      setIsMaterialsOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <div className={styles.column}>
      <Materials
        materials={getValues("materials")}
        isMaterialsOpen={isMaterialsOpen}
        setIsMaterialsOpen={setIsMaterialsOpen}
        isDisabled={isExternalItems}
        setValueOffer={setValue}
      />

      {/* date */}
      <div
        className={classNames(styles.group, errors.date && styles.error)}
      >
        <input
          className={styles.input}
          type="date"
          disabled={isExternalItems || !task}
          {...register("date", { required: true })}
        />
        <span className={classNames(styles.span, styles.active)}>{"Date"}</span>
      </div>
      {/* time */}
      <>
        <div className={styles.group}>
          <div
            onClick={
              !isExternalItems ? () => setTimeEnterOpened("start") : undefined
            }
            className={classNames(
              styles.timeInput,
              errors.start_time && styles.error,
              !isExternalItems && styles.hideDisabled
            )}
          >
            <div className={styles.empty}></div>
            <span className={classNames(styles.span, styles.active)}>
              {"Anfangszeit"}
            </span>
            <input
              type="text"
              className={styles.input}
              {...register("start_time", {
                required: !isExternalItems,
              })}
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

        <div className={styles.group}>
          <div
            onClick={!isExternalItems ? () => setTimeEnterOpened("end") : undefined}
            className={classNames(
              styles.timeInput,
              errors.end_time && styles.error,
              !isExternalItems && styles.hideDisabled
            )}
          >
            <div className={styles.empty}></div>
            <span className={classNames(styles.span, styles.active)}>
              {"Endzeit"}
            </span>
            <input
              type="text"
              className={styles.input}
              {...register("end_time", {
                required: !isExternalItems,
              })}
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
        {errors.end_time?.message && errors.end_time.message.length > 0 && (
          <span className={styles.errorMessage}>{errors.end_time.message}</span>
        )}
      </>
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
    </div>
  )
}

export default RightInputsGroup
