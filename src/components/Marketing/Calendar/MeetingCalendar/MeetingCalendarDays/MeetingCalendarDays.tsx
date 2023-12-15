// react-redux
import { FC } from "react";
// libs
import moment from "moment";
import { v1 } from "uuid";
// styles
import styles from "./index.module.scss";
import classNames from "classnames";

interface MeetingCalendarDaysProps {
  currentDay: string;
  type: "online" | "offline";
  onClickDay: (day: moment.Moment) => void;
  daysArray: moment.Moment[];
}

const MeetingCalendarDays: FC<MeetingCalendarDaysProps> = ({
  currentDay,
  type,
  onClickDay,
  daysArray
}) => {
  const Days = daysArray.map((d) => {
    const isWeekend = [7].includes(d.isoWeekday());

    return (
      <div
        key={v1()}
        className={classNames(styles.day, {
          [styles.dayCurrent]: d.isSame(currentDay, "day"),
        })}
        onClick={() => onClickDay(d)}
      >
        <span
          className={classNames(styles.dayNumber, {
            [styles.notCurrentMonth]: !d.isSame(moment(), "month"),
          })}
        >
          {d.format("D")}
        </span>
        {isWeekend || type === "offline" ? (
          <span className={styles.offline}></span>
        ) : (
          <span className={styles.online}></span>
        )}
      </div>
    );
  });

  return Days;
};

export default MeetingCalendarDays;
