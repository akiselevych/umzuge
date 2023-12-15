// react-redux
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMeetings,
  getMeetingsBooking,
} from "reduxFolder/slices/Calendar.slice";
import { useActions } from "hooks/useActions";
// components
import Blocks from "./Blocks/Blocks";
import Meetings from "./Meetings/Meetings";
import HeaderCalendar from "./MeetingCalendar/HeaderCalendar/HeaderCalendar";
import MeetingCalendar from "./MeetingCalendar/MeetingCalendar";
// libs
import moment from "moment";
// types
import type { AppDispatch, RootStateType } from "types/index";
import type { IMeetingBook, IMeetingBookResponse } from "types/calendar";
import type { EventNameType } from "./Types/EventNameType";
// styles
import styles from "./index.module.scss";

export type FilterByType = "online" | "offline" | "all";

const Calendar = () => {
  const [dropDownOption, setDropDownOption] = useState<FilterByType>("all");
  const [status, setStatus] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { setMeetingCalendarEvent } = useActions();
  const activeEvent = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarEvent
  );
  const bookedMeetings = useSelector(
    (state: RootStateType) => state.Calendar.meetingBooking
  );
  const meetings = useSelector(
    (state: RootStateType) => state.Calendar.meetings
  );

  useEffect(() => {
    switch (status) {
      case "upcoming":
        dispatch(
          getMeetingsBooking({
            type: dropDownOption,
            date_range_after: moment().format("YYYY-MM-DD"),
          })
        );

        break;
      case "past":
        dispatch(
          getMeetingsBooking({
            type: dropDownOption,
            date_range_before: moment().format("YYYY-MM-DD"),
          })
        );
        break;
      default:
        break;
    }
  }, [dropDownOption, status]);

  const filterMeetings = (meetings: IMeetingBook[]) => {
    const currentDate = moment();
    let filteredList: IMeetingBook[] = [];

    switch (status) {
      case "upcoming":
        filteredList = meetings
          .filter(
            (meeting) =>
              moment(`${meeting.date} ${meeting.time}`).isAfter(
                moment().format("YYYY-MM-DD HH:mm")
              ) ||
              moment(`${meeting.date} ${meeting.time}`).isSame(
                moment().format("YYYY-MM-DD HH:mm")
              )
          )
          .sort((a, b) => {
            const dateA = moment(`${a.date} ${a.time}`);
            const dateB = moment(`${b.date} ${b.time}`);

            return dateA.diff(dateB);
          });

        break;
      case "past":
        filteredList = meetings
          .filter((meeting) =>
            moment(`${meeting.date} ${meeting.time}`).isBefore(currentDate)
          )
          .sort((a, b) => {
            const dateA = moment(`${a.date} ${a.time}`);
            const dateB = moment(`${b.date} ${b.time}`);

            return dateB.diff(dateA);
          });
        break;
      default:
        break;
    }

    return filteredList;
  };

  const handleTabEvent = (event: EventNameType) => {
    dispatch(setMeetingCalendarEvent(event));
  };

  const filteredMeetings = useMemo(
    () => (bookedMeetings?.length ? filterMeetings(bookedMeetings) : null),
    [bookedMeetings]
  );

  return (
    <div className={styles.box}>
      <header className={styles.header}>
        <HeaderCalendar
          activEvent={activeEvent}
          search={search}
          status={status}
          handleTabEvent={handleTabEvent}
          setSearch={setSearch}
          setStatus={setStatus}
          setDropDownOption={setDropDownOption}
        />
      </header>
      {activeEvent === "EventTypes" && (
        <div className={styles.blocks}>
          <hr className={styles.hr} />
          <div className={styles.container}>
            <Blocks search={search} />
          </div>
        </div>
      )}
      {activeEvent === "Scheduled" && (
        <div>
          <div className={styles.meetings}>
            <hr className={styles.hr} />
            <Meetings
              dropDownOption={dropDownOption}
              meetings={filteredMeetings}
              setDropDownOption={setDropDownOption}
              status={status}
            />
          </div>
        </div>
      )}
      {activeEvent === "Create" && (
        <div>
          <MeetingCalendar meetings={meetings} />
        </div>
      )}
    </div>
  );
};

export default Calendar;
