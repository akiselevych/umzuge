// react-redux
import React, { useEffect } from "react";
import { useActions } from "hooks/useActions";
import { getMeetings } from "reduxFolder/slices/Calendar.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootStateType } from "types/index";
// components
import Block from "../Block/Block";
// types
import type { IMeeting, IMeetingsResponse } from "types/calendar";
// styles
import styles from "./index.module.scss";
import moment from "moment";

interface IBlocks {
  search: string;
}

const Blocks: React.FC<IBlocks> = ({ search }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setMeetingCalendarType, setMeetingCalendarEvent } = useActions();
  const meetings = useSelector(
    (state: RootStateType) => state.Calendar.meetings
  );

  const onActionClick = (status: "online" | "offline") => {
    dispatch(setMeetingCalendarEvent("Create"));
    dispatch(setMeetingCalendarType(status));
  };

  useEffect(() => {
    dispatch(getMeetings({ type: "all" }));
  }, []);

  const searchMeetings = (meetings: IMeetingsResponse) => {
    if (search !== "") {
      const filteredList = meetings.results.filter((meeting) =>
        meeting.name.toLowerCase().includes(search.toLowerCase())
      );

      return filteredList;
    } else {
      return meetings.results;
    }
  };

  const searchedMeetings = meetings?.results.length
    ? searchMeetings(meetings)
    : null;

  const uniqueMeetings =
    searchedMeetings && !!searchedMeetings.length
      ? searchedMeetings.reduce((acc: IMeeting[], meeting) => {
          const uniqueNames = new Set(acc.map((m: IMeeting) => m.name));

          if (!uniqueNames.has(meeting.name)) {
            acc.push(meeting);
          }

          return acc;
        }, [])
      : [];

  return (
    <div className={styles.blocks}>
      {uniqueMeetings &&
        uniqueMeetings.map((meeting) => (
          <Block
            key={meeting.id}
            meetingDuration={1}
            status={meeting.type}
            name={meeting.name}
            onActionClick={() => onActionClick(meeting.type)}
          />
        ))}
      {/* <Block
        meetingDuration={1}
        status="online"
        onActionClick={() => onActionClick("online")}
      />
      <Block
        meetingDuration={1}
        status="offline"
        onActionClick={() => onActionClick("offline")}
      /> */}
    </div>
  );
};

export default Blocks;
