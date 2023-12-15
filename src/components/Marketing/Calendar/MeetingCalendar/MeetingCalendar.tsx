/* eslint-disable react-hooks/exhaustive-deps */
// react-redux
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";
import { useActions } from "hooks/useActions";
import {
  addMeeting,
  editMeeting,
  getMeetings,
} from "reduxFolder/slices/Calendar.slice";
// components
import ReactSelect, { type StylesConfig } from "react-select";
import DaysNames from "components/Calendar/MonthCalendar/DaysNames/DaysNames";
import MeetingCalendarGrid from "./MeetingCalendarGrid/MeetingCalendarGrid";
import ModalWindow from "components/ModalWindow/ModalWindow";
import InputMask from "react-input-mask";
// libs
import { formatTimeToHourMinute } from "utils/formatTimeToHourMinute";
import moment from "moment";
import { de } from "date-fns/locale";
import { format, parseISO } from "date-fns";
// forms
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
// types
import type {
  IMeeting,
  IMeetingEditBody,
  IMeetingsResponse,
} from "types/calendar";
import type { AppDispatch, RootStateType } from "types/index";
// images
import cancelIcon from "assets/icons/cancel.svg";
import editIcon from "assets/icons/editWhite.svg";
import plusIcon from "assets/icons/blackPlus.svg";
import plusIconWhite from "assets/icons/plus.svg";
// styles
import styles from "./index.module.scss";
import classNames from "classnames";

interface MeetingEventSchema {
  eventName: string;
  eventType: "online" | "offline";
  times: {
    start_time: string;
    end_time: string;
  }[];
}

interface IMeetingCalendar {
  meetings: IMeetingsResponse | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const selectStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    padding: "4px 4px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "110px",
    zIndex: 10,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "110px",
    overflowY: "auto",
    zIndex: 10,
  }),
};

const meetingType = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

const MeetingCalendar: React.FC<IMeetingCalendar> = ({ meetings }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setMeetingCalendarType } = useActions();

  const [isModal, setIsModal] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const currentDay = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarDay
  );
  const meetingsType = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarType
  );
  const slots = meetings;

  const divideTimeSlots = (slots: IMeeting[]) => {
    if (slots && slots.length > 0) {
      const intervals: IMeeting[][] = [];
      let currentInterval: IMeeting[] = [];

      slots.forEach(({ time, ...restSlot }, index) => {
        const currentTime = moment(
          restSlot.date + " " + time,
          "YYYY-MM-DD HH:mm:ss"
        );

        if (index === 0) {
          currentInterval.push({
            time: currentTime.format("YYYY-MM-DD HH:mm:ss"),
            ...restSlot,
          });
        } else {
          const prevTime = moment(
            slots[index - 1].date + " " + slots[index - 1].time,
            "YYYY-MM-DD HH:mm:ss"
          );
          if (currentTime.diff(prevTime, "hours") > 1) {
            // New interval starts
            intervals.push(currentInterval);
            currentInterval = [
              {
                time: currentTime.format("YYYY-MM-DD HH:mm:ss"),
                ...restSlot,
              },
            ];
          } else {
            currentInterval.push({
              time: currentTime.format("YYYY-MM-DD HH:mm:ss"),
              ...restSlot,
            });
          }
        }
      });

      if (currentInterval.length > 0) {
        intervals.push(currentInterval);
      }

      return intervals;
    }
  };

  const sortedSlots = useMemo(
    () =>
      !!slots?.results?.length &&
      slots.results.slice().sort((a, b) => {
        const timeA = moment(a.time, "HH:mm:ss");
        const timeB = moment(b.time, "HH:mm:ss");

        return timeA.isBefore(timeB) ? -1 : 1;
      }),
    [slots]
  );

  const dividedSlots = useMemo(
    () => sortedSlots && !!sortedSlots.length && divideTimeSlots(sortedSlots),
    [sortedSlots]
  );

  const { control, handleSubmit, reset, setValue, clearErrors, watch } =
    useForm<MeetingEventSchema>({
      defaultValues: {
        eventName: "Online meeting",
        eventType: meetingsType,
      },
    });

  const { append, remove, fields } = useFieldArray<MeetingEventSchema>({
    control,
    name: "times",
  });

  useEffect(() => {
    dispatch(getMeetings({ date: currentDay, type: watch("eventType") }));
    setMeetingCalendarType(watch("eventType"));
  }, [currentDay, watch("eventType")]);

  useEffect(() => {
    setValue(
      "eventName",
      meetingsType === "online" ? "Online meeting" : "Offline meeting"
    );
  }, [meetingsType]);

  useEffect(() => {
    if (dividedSlots && dividedSlots.length > 0) {
      setValue(
        "times",
        dividedSlots.map((slot) => ({
          start_time: moment(slot[0].time).format("HH:mm:ss"),
          end_time: moment(slot[slot.length - 1].time)
            .add(1, "hour")
            .format("HH:mm:ss"),
        }))
      );
    } else {
      setValue("times", [
        {
          start_time: "",
          end_time: "",
        },
      ]);
    }
  }, [slots]);

  const onSubmit: SubmitHandler<MeetingEventSchema> = (data) => {
    if (isEditing) {
      const payload: IMeetingEditBody = {
        new_name: data.eventName,
        old_name: data.eventName,
        new_type: data.eventType,
        old_type: data.eventType,
        times: data.times,
        date: currentDay,
        sale_man_id: 1,
      };

      dispatch(editMeeting(payload)).then(() => {
        setIsModal(false);
        setIsCreating(false);
        setIsEditing(false);

        dispatch(getMeetings({ date: currentDay, type: watch("eventType") }));

        reset();
        clearErrors();
      });
    }

    if (isCreating) {
      const payload = {
        times: data.times,
        date: currentDay,
        type: data.eventType,
        sale_man_id: 1,
        name: data.eventName,
      };

      dispatch(addMeeting(payload)).then(() => {
        setIsModal(false);
        setIsCreating(false);
        setIsEditing(false);

        dispatch(getMeetings({ date: currentDay, type: watch("eventType") }));

        reset();
        clearErrors();
      });
    }
  };

  const onModalClose = () => {
    setIsModal(false);
    setIsCreating(false);
    setIsEditing(false);
    reset();
    clearErrors();
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <form
          className={styles.form}
          id="date-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.formItem}>
            <div className={styles.label}>Event name*</div>
            <Controller
              name="eventName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input type="text" className={styles.input} {...field} />
              )}
            />
          </div>
          <div className={styles.formItem}>
            <div className={styles.label}>Event type*</div>
            <Controller
              name="eventType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  options={meetingType}
                  defaultValue="online"
                  placeholder="Select..."
                  value={meetingType.find((c) => c.value === field.value)}
                  onChange={(val: any) => field.onChange(val.value)}
                  styles={selectStyles}
                  isSearchable={false}
                />
              )}
            />
          </div>
          <ModalWindow
            isModaltOpen={isModal}
            onClose={onModalClose}
            setIsModaltOpen={setIsModal}
            size="tiny"
            withLogo={false}
          >
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>
                {moment(currentDay).format("D MMMM YYYY")}
              </h3>
              {!sortedSlots && (
                <div className={styles.modalContainer}>
                  {fields.map((field, index) => (
                    <div className={styles.modalItem} key={field.id}>
                      <div className={styles.modalItemSlot}>
                        <div className={styles.modaldateContainer}>
                          <div className={styles.modaldateSlotContainer}>
                            <Controller
                              name={`times.${index}.start_time`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99:99"
                                  alwaysShowMask
                                  className={styles.modaldateSlot}
                                  onChange={(e) =>
                                    field.onChange(`${e.target.value}:00`)
                                  }
                                  value={field.value}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            <div className={styles.modaldateSlotStroke}></div>
                            <Controller
                              name={`times.${index}.end_time`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99:99"
                                  alwaysShowMask
                                  className={styles.modaldateSlot}
                                  onChange={(e) =>
                                    field.onChange(`${e.target.value}:00`)
                                  }
                                  value={field.value}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={styles.modalItemIcons}>
                        <button onClick={() => remove(index)}>
                          <img src={cancelIcon} alt="Delete icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ start_time: "", end_time: "" })}
                    className={styles.modalAddField}
                  >
                    <img src={plusIcon} alt="Plus Icon" />
                    Add
                  </button>
                  <button
                    type="submit"
                    form="date-form"
                    className={styles.submitButton}
                  >
                    Save
                  </button>
                </div>
              )}

              {dividedSlots && !!dividedSlots.length && (
                <div className={styles.modalContainer}>
                  {fields.map((field, index) => (
                    <div className={styles.modalItem} key={field.id}>
                      <div className={styles.modalItemSlot}>
                        <div className={styles.modaldateContainer}>
                          <div className={styles.modaldateSlotContainer}>
                            <Controller
                              name={`times.${index}.start_time`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99:99"
                                  alwaysShowMask
                                  className={styles.modaldateSlot}
                                  onChange={(e) =>
                                    field.onChange(`${e.target.value}:00`)
                                  }
                                  value={field.value}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                            <div className={styles.modaldateSlotStroke}></div>
                            <Controller
                              name={`times.${index}.end_time`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99:99"
                                  alwaysShowMask
                                  className={styles.modaldateSlot}
                                  onChange={(e) =>
                                    field.onChange(`${e.target.value}:00`)
                                  }
                                  value={field.value}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={styles.modalItemIcons}>
                        <button onClick={() => remove(index)}>
                          <img src={cancelIcon} alt="Delete icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ start_time: "", end_time: "" })}
                    className={styles.modalAddField}
                  >
                    <img src={plusIcon} alt="Plus Icon" />
                    Add
                  </button>
                  <button
                    type="submit"
                    form="date-form"
                    className={styles.submitButton}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </ModalWindow>
        </form>
        <div className={styles.date}>
          <h3 className={styles.dateTitle}>
            {format(parseISO(currentDay), "d MMMM", {
              locale: de,
            })}
          </h3>
          {sortedSlots &&
            sortedSlots.map((slot) => (
              <div className={styles.dateContainer} key={slot.id}>
                <div
                  className={classNames(styles.dateSlotContainer, {
                    [styles.dateSlotContainerDisabled]: !slot.available,
                  })}
                >
                  <div
                    className={classNames(styles.dateSlot, {
                      [styles.dateSlotDisabled]: !slot.available,
                    })}
                  >
                    {formatTimeToHourMinute(slot.time)}
                  </div>
                  <div
                    className={classNames(styles.dateSlotStroke, {
                      [styles.dateSlotStrokeDisabled]: !slot.available,
                    })}
                  ></div>
                  <div
                    className={classNames(styles.dateSlot, {
                      [styles.dateSlotDisabled]: !slot.available,
                    })}
                  >
                    {moment(slot.time, "HH:mm:ss")
                      .add(1, "hours")
                      .format("HH:mm")}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className={styles.buttonWrapper}>
          {sortedSlots ? (
            <button
              type="button"
              onClick={() => {
                setIsModal(true);
                setIsEditing(true);
              }}
              className={styles.button}
            >
              Edit{" "}
              <img
                src={editIcon}
                style={{ width: 14, height: 14 }}
                alt="Plus Icon"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsModal(true);
                setIsCreating(true);
              }}
              className={styles.button}
            >
              Add{" "}
              <img
                src={plusIconWhite}
                style={{ width: 21, height: 21 }}
                alt="Plus Icon"
              />
            </button>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <DaysNames />
        <MeetingCalendarGrid />
      </div>
    </div>
  );
};

export default MeetingCalendar;
