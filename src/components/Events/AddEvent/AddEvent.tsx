import { Dispatch, FC, useState } from "react"
import "styles/index.scss"
import styles from "components/Events/AddEvent/AddEvent.module.scss"
import SubmitButton from "components/SubmitButton/SubmitButton"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { addEvent } from "reduxFolder/slices/Table.slice"
import classNames from "classnames"
import EnterTimePopUp from "components/EnterTimePopUp/EnterTimePopUp"
import InputMUI from "components/InputMUI/InputMUI"
import moment from "moment"
import calendarIcon from "assets/icons/addEvent/calendar.svg"
import ellipseIcon from "assets/icons/addEvent/Ellipse.svg"
import plusIcon from "assets/icons/addEvent/plus.svg"

type FieldsType = {
  image: FileList | null
  name: string
  description: string
  date: string
  start_time: string
  start_time_hours1: string
  start_time_hours2: string
  start_time_minutes1: string
  start_time_minutes2: string
  end_time: string
  end_time_hours1: string
  end_time_hours2: string
  end_time_minutes1: string
  end_time_minutes2: string
}

const AddEvent: FC<{
  setIsAddEventOpen: Dispatch<React.SetStateAction<boolean>>
  setIsNotifivationVisible: Dispatch<React.SetStateAction<boolean>>
}> = ({ setIsAddEventOpen, setIsNotifivationVisible }) => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    setError,
  } = useForm<FieldsType>({
    defaultValues: {
      image: null,
      name: "",
      description: "",
      date: undefined,
      start_time: "12:00",
      start_time_hours1: "1",
      start_time_hours2: "2",
      start_time_minutes1: "0",
      start_time_minutes2: "0",
      end_time: "16:00",
      end_time_hours1: "1",
      end_time_hours2: "6",
      end_time_minutes1: "0",
      end_time_minutes2: "0",
    },
  })

  const watchFields = watch()
  const watchImage = watch("image")
  const [timeEnterOpened, setTimeEnterOpened] = useState<"start" | "end" | null>(
    null
  )

  async function onSubmit(data: FieldsType) {
    const formData = new FormData()
    if (data.image) {
      formData.set("image", data.image[0])
    }

    const startTime = moment(data.start_time, "HH:mm")
    const endTime = moment(data.end_time, "HH:mm")

    if (startTime.isAfter(endTime)) {
      setError("end_time", {
        message: "End time should be after start time",
      })
      return
    }

    const finalData = { ...data, image: data.image ? formData : null }
    const response = await dispatch(addEvent(finalData))
    if (response.meta.requestStatus !== "rejected") {
      setIsAddEventOpen(false)
      setIsNotifivationVisible(true)
    }
  }

  return (
    <form className={styles.addEvent} onSubmit={handleSubmit(onSubmit)}>
      <header className={styles.header}>
        <h2 className="modalTitle">Ein neues Ereignis hinzufügen</h2>
        <SubmitButton />
      </header>

      <main>
        <div className={styles.addImg}>
          <label>
            <input type="file" {...register("image")} accept=".jpg, .png, .jpeg" />
            {watchImage && watchImage[0] && (
              <img
                src={URL.createObjectURL(watchImage[0])}
                className={styles.preview}
              />
            )}
            <img src={ellipseIcon} className={styles.ellipse} />
            <img src={calendarIcon} className={styles.calendar} />
            <img src={plusIcon} className={styles.plus} />
          </label>
          <div className={styles.fileName}>
            {watchImage && watchImage[0] && watchImage[0].name}
          </div>
        </div>

        <div className={styles.fields}>
          <div className={errors.name && styles.error}>
            <InputMUI
              type="text"
              label="Ereignis"
              name="name"
              register={register}
              watchFields={watchFields}
              required
            />
          </div>
          <div className={errors.date && styles.error}>
            <InputMUI
              type="date"
              label="Datum"
              name="date"
              register={register}
              watchFields={watchFields}
              required
            />
          </div>
          {/* start time */}
          <div className={styles.group}>
            <div
              onClick={() => setTimeEnterOpened("start")}
              className={classNames(
                styles.timeInput,
                errors.start_time && styles.error
              )}
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
          {/* end time */}
          <div className={styles.group}>
            <div
              onClick={() => setTimeEnterOpened("end")}
              className={classNames(
                styles.timeInput,
                errors.end_time && styles.error
              )}
            >
							<div className={styles.empty}></div>
              <span className={classNames(styles.span, styles.active)}>
                {"Endzeit"}
              </span>
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
          <div className={errors.description && styles.error}>
            <InputMUI
              type="text"
              label="Beschreibung"
              name="description"
              register={register}
              watchFields={watchFields}
              required
            />
          </div>
        </div>
        {errors.end_time?.message && errors.end_time.message.length > 0 && (
          <span className={styles.errorMessage}>{errors.end_time.message}</span>
        )}
      </main>
    </form>
  )
}

export default AddEvent
