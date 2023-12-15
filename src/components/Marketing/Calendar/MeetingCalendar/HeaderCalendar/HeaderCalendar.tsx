// react-redux
import { useSelector } from "react-redux";
import { useActions } from "hooks/useActions";
import { useEffect, useState } from "react";
// types
import type { EventNameType } from "../../Types/EventNameType";
import type { RootStateType } from "types/index";
import type { FilterByType } from "../..";
// images
import xMarkIcon from "assets/icons/xmark.svg";
import line from "assets/icons/line.svg";
import smallPlus from "assets/icons/smallPlus.svg";
import arrowIcon from "assets/icons/arrow.svg";
// styles
import classNames from "classnames";
import styles from "./index.module.scss";
// components
import DatePicker, { registerLocale } from "react-datepicker";
// libs
import { de } from "date-fns/locale";
import moment from "moment";
import { format } from "date-fns";

interface IHeaderCalendar {
  activEvent: EventNameType;
  search: string;
  status: "upcoming" | "past";
  handleTabEvent: (tabName: EventNameType) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setDropDownOption: React.Dispatch<React.SetStateAction<FilterByType>>;
  setStatus: React.Dispatch<
    React.SetStateAction<"upcoming" | "past">
  >;
}

const HeaderCalendar = ({
  activEvent,
  search,
  status,
  setStatus,
  handleTabEvent,
  setSearch,
}: IHeaderCalendar) => {
  moment.locale("de");
  registerLocale("de", de);
  const currentDay = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarDay
  );
  const type = useSelector(
    (state: RootStateType) => state.Calendar.meetingCalendarType
  );
  const { setMeetingCalendarDay } = useActions();

  const [isPickerDisplayed, setIsPickerDisplayed] = useState(false);
  const displayDate = format(new Date(currentDay), "MMMM yyyy", { locale: de });

  function handleDateChange(date: Date) {
    setMeetingCalendarDay(moment(date).format("YYYY-MM-DD"));
    setIsPickerDisplayed(false);
  }

  useEffect(() => {
    function handleClickOutside(e: globalThis.MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.className !== styles.datePicker &&
        !target.closest("div")?.className.includes("react-datepicker") &&
        target.tagName !== "H2" &&
        target.tagName !== "IMG"
      ) {
        setIsPickerDisplayed(false);
      }
    }
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div>
      {activEvent === "Create" ? (
        <div className={styles.createContainer}>
          <h2 className={styles.meetingTitle}>
            <span
              className={classNames(styles.circle, {
                [styles.circleOffline]: type === "offline",
              })}
            ></span>
            {type === "online" ? "Online meeting" : "Offline meeting"}
          </h2>
          <button
            className={classNames(styles.createButton, styles.createButtonBack)}
            onClick={() => handleTabEvent("EventTypes")}
          >
            {"< Back to events"}
          </button>
        </div>
      ) : (
        <div className={styles.switcher}>
          <button
            style={
              activEvent === "Scheduled"
                ? {
                    paddingRight: "10px",
                  }
                : undefined
            }
            className={activEvent === "EventTypes" ? styles.active : ""}
            onClick={() => handleTabEvent("EventTypes")}
            type="button"
          >
            Event types
          </button>
          <img src={line} className={styles.line} />
          <button
            style={
              activEvent === "Scheduled"
                ? {
                    marginLeft: "15px",
                  }
                : undefined
            }
            className={activEvent === "Scheduled" ? styles.active : ""}
            onClick={() => handleTabEvent("Scheduled")}
            type="button"
          >
            Scheduled events
          </button>
        </div>
      )}
      <div className={styles.searchCreate}>
        {activEvent === "EventTypes" && (
          <div className={styles.search}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Suchen"
            />
            <img
              src={xMarkIcon}
              onClick={() => setSearch("")}
              className={styles.microphoneIcon}
              style={
                search.length === 0 ? { display: "none" } : { display: "block" }
              }
              alt="microphoneIcon"
            />
          </div>
        )}
        {activEvent === "Scheduled" && (
          <div style={{ marginTop: "60px" }} className={styles.switcher}>
            <button
              className={status === "upcoming" ? styles.active : ""}
              type="button"
              onClick={() => setStatus("upcoming")}
            >
              Upcoming
            </button>
            <img src={line} className={styles.line} />
            <button
              className={status === "past" ? styles.active : ""}
              type="button"
              onClick={() => setStatus("past")}
            >
              Past
            </button>
          </div>
        )}
        {activEvent === "Create" && (
          <div className={styles.datePickerContainer}>
            <div className={styles.datePickerLeft}></div>
            <div className={styles.datePickerRight}>
              <div className={styles.datePickerTitle}>
                <h2 onClick={() => setIsPickerDisplayed(true)}>
                  {displayDate}
                  <img src={arrowIcon} alt="" />
                </h2>
              </div>
              {isPickerDisplayed && (
                <div
                  className={classNames(
                    styles.datePicker,
                    "custom-date-picker"
                  )}
                >
                  <DatePicker
                    selected={new Date(displayDate)}
                    onChange={handleDateChange}
                    inline
                    showMonthYearPicker
                    dateFormat="MM/yyyy"
                    locale="de"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activEvent !== "Create" && (
          <button
            className={styles.createButton}
            onClick={() => handleTabEvent("Create")}
          >
            Create <img src={smallPlus} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderCalendar;
