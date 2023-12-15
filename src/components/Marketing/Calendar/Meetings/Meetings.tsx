// react-redux
import React, { FC, useEffect, useRef, useState } from "react";
// components
import MeetingDetails from "../Meeting/MeetingDetails";
// libs
import moment from "moment";
// types
import type { FilterByType } from "..";
import type { IMeetingBook } from "types/calendar";
// images
import filter from "assets/icons/filter.svg";
import arrowDown from "assets/icons/arrowDown.svg";
// styles
import styles from "./index.module.scss";
import classNames from "classnames";

const dropDownStatuses: FilterByType[] = ["all", "online", "offline"];

interface IMeetings {
  meetings: IMeetingBook[] | null;
  dropDownOption: FilterByType;
  status: "upcoming" | "past";
  setDropDownOption: React.Dispatch<React.SetStateAction<FilterByType>>;
}

const Meetings: FC<IMeetings> = ({
  meetings,
  dropDownOption,
  status,
  setDropDownOption,
}) => {
  const [filterDropdown, setFilterDropdown] = useState(false);

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setFilterDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const MeetingsComponents = (filterBy: FilterByType) => {
    if (meetings?.length) {
      if (filterBy !== "all") {
        const filteredMeetings = meetings.filter(
          (meeting) => meeting.type === filterBy
        );

        return filteredMeetings.map((meeting) => (
          <MeetingDetails
            key={meeting.id}
            color={meeting.type === "online" ? "#00538E" : "#D4ECF3"}
            date={meeting.date}
            time={`${meeting.time} ${meeting.date}`}
            name={meeting.customers[0].name}
            kind={meeting.customers.length > 1 ? "Group" : "One-on-One"}
            status={status}
            details={{
              id: meeting.id,
              customers: meeting.customers,
              floorOld: meeting.floor_from,
              floorNew: meeting.floor_to,
              friendly_end_address: meeting.friendly_end_address,
              end_address: meeting.end_address,
              start_address: meeting.start_address,
              friendly_start_address: meeting.friendly_start_address,
              space: meeting.space,
              join_web_url: meeting.join_web_url,
              status,
            }}
          />
        ));
      } else {
        return meetings.map((meeting) => (
          <MeetingDetails
            key={meeting.id}
            color={meeting.type === "online" ? "#00538E" : "#D4ECF3"}
            date={meeting.date}
            time={`${meeting.time} ${meeting.date}`}
            name={meeting.customers[0].name}
            kind={meeting.customers.length > 1 ? "Group" : "One-on-One"}
            status={status}
            details={{
              id: meeting.id,
              customers: meeting.customers,
              floorOld: meeting.floor_from,
              floorNew: meeting.floor_to,
              friendly_end_address: meeting.friendly_end_address,
              end_address: meeting.end_address,
              start_address: meeting.start_address,
              friendly_start_address: meeting.friendly_start_address,
              space: meeting.space,
              join_web_url: meeting.join_web_url,
              status,
            }}
          />
        ));
      }
    } else {
      return (
        <div className={styles.noMeetings}>
          <p>You don't have any sheduled meetings today.</p>
        </div>
      );
    }
  };

  const DropDownComponents = () => {
    return dropDownStatuses.map((status: FilterByType, index) => (
      <div className={styles.dropDownItem} key={index}>
        <p
          key={status}
          className={classNames(dropDownOption === status && styles.active)}
          onClick={() => setDropDownOption(status)}
        >
          {status}
        </p>
        {index !== dropDownStatuses.length - 1 ? <hr /> : ""}
      </div>
    ));
  };

  function handleFilterDropdown() {
    setFilterDropdown(!filterDropdown);
  }

  return (
    <>
      <div className={styles.outContainer}>
        <div className={styles.timeFrame}>
          {status === "upcoming" ? (
            <h1>UPCOMING MEETINGS</h1>
          ) : (
            <h1>PAST MEETINGS</h1>
          )}
        </div>

        <div ref={dropDownRef} className={styles.filter}>
          <img src={filter} onClick={handleFilterDropdown} />
          <button onClick={handleFilterDropdown}>Filter</button>
          <img src={arrowDown} onClick={handleFilterDropdown} />
          <div
            className={classNames(
              styles.dropDown,
              filterDropdown === false && styles.hidden
            )}
          >
            {DropDownComponents()}
          </div>
        </div>
      </div>
      <div className={styles.meetings}>
        {MeetingsComponents(dropDownOption)}
      </div>
    </>
  );
};

export default Meetings;
