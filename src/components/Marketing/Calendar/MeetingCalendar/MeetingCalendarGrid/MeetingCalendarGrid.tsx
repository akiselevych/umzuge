// components
import MeetingCalendarDays from "../MeetingCalendarDays/MeetingCalendarDays";
// react-redux
import { useDispatch, useSelector } from "react-redux";
import { useActions } from "hooks/useActions";
// libs
import moment from "moment";
// types
import { useMemo, type FC } from "react";
import type { AppDispatch, RootStateType } from "types/index";
// styles
import styles from "./index.module.scss";

const MeetingCalendarGrid: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  moment.updateLocale("en", { week: { dow: 0 } });

  const { setMeetingCalendarDay } = useActions();

  const currentDay = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarDay
  );
  const type = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarType
  );

  const onClickDay = (day: moment.Moment) => {
    dispatch(setMeetingCalendarDay(day.format("YYYY-MM-DD")));
  };

  function generateDaysArray(currentDate: string) {
    const startDay = moment(currentDate, "YYYY-MM-DD")
      .startOf("month")
      .startOf("week");

    return [...Array(42)].map(() => startDay.add(1, "day").clone());
  }

  const daysArray = useMemo(() => generateDaysArray(currentDay), [currentDay]);

  return (
    <>
      <div className={styles.calendar}>
        <MeetingCalendarDays
          type={type}
          onClickDay={onClickDay}
          currentDay={currentDay}
          daysArray={daysArray}
        />
      </div>
    </>
  );
};

export default MeetingCalendarGrid;
