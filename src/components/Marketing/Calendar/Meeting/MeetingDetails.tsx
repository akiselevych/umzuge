import { useState } from "react";
// libs
import moment from "moment";
import "moment/locale/de";
moment.locale("de", {
  months: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Juni",
    "Juli",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  weekdays: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
});
// types
import { DetailsType } from "../Types/DetailsType";
// images
import plusIcon from "assets/icons/phosphorPlus.svg";
import minusIcon from "assets/icons/phosphorMinus.svg";
// styles
import styles from "./index.module.scss";
import classNames from "classnames";

interface IMeetingProps {
  color: string;
  date: string;
  time: string;
  name: string;
  kind: "One-on-One" | "Group";
  details: DetailsType;
  status: "upcoming" | "past";
}

const MeetingDetails = ({
  color,
  date,
  time,
  name,
  kind,
  details,
  status,
}: IMeetingProps) => {
  const [toggleDetails, setToogleDetails] = useState(false);

  function handleDetailsClick() {
    setToogleDetails(!toggleDetails);
  }

  return (
    <div className={styles.container}>
      <div className={styles.listItem}>
        <div
          className={classNames(styles.time, {
            [styles.timeToggled]: toggleDetails,
          })}
        >
          <div className={styles.timeInner}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <circle cx="18" cy="18" r="18" fill={color} />
            </svg>
            {status === "upcoming" ? (
              <p>
                {moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").format(
                  "D MMMM HH:mm"
                )}{" "}
                -{" "}
                {moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss")
                  .add(1, "hours")
                  .format("HH:mm")}
              </p>
            ) : (
              <p>
                {moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").format(
                  "D MMMM HH:mm"
                )}
              </p>
            )}
          </div>
        </div>

        <div className={styles.detailItem}>
          <p className={styles.detailItemLabel}>{name}</p>
          <span className={styles.detailItemValue}>{kind}</span>
        </div>

        {toggleDetails && (
          <div className={styles.detailItem}>
            <p className={styles.detailItemLabel}>Wohnfläche in m2</p>
            <span className={styles.detailItemValue}>{details.space}</span>
          </div>
        )}

        <div className={styles.detailsButton}>
          <button onClick={handleDetailsClick}>Details</button>
          {toggleDetails ? (
            <img src={minusIcon} onClick={handleDetailsClick} />
          ) : (
            <img src={plusIcon} onClick={handleDetailsClick} />
          )}
        </div>
      </div>

      <div
        className={classNames(styles.details, {
          [styles.hidden]: !toggleDetails,
        })}
      >
        {toggleDetails && (
          <div className={styles.detailsContainer}>
            <div className={styles.changers}></div>

            <div className={styles.contactsInner}>
              <div className={styles.contacts}>
                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Email</p>
                  <span className={styles.detailItemValue}>
                    {details.customers[0].email}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Telefon number</p>
                  <span className={styles.detailItemValue}>
                    {details.customers[0].phone}
                  </span>
                </div>

                {details.join_web_url && (
                  <div className={styles.detailItem}>
                    <p className={styles.detailItemLabel}>Link</p>
                    <a
                      href={details.join_web_url}
                      target="_blank"
                      className={styles.detailItemValue}
                    >
                      {details.join_web_url.substring(0, 20) + "..."}
                    </a>
                  </div>
                )}
              </div>

              <div className={styles.contacts}>
                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Einzugsadresse</p>
                  <span className={styles.detailItemValue}>
                    {details.friendly_end_address}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Etage - alte Wohnung</p>
                  <span className={styles.detailItemValue}>
                    {details.floorOld} Etage
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Auszugsadresse</p>
                  <span className={styles.detailItemValue}>
                    {details.friendly_start_address}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <p className={styles.detailItemLabel}>Etage - neue Wohnung</p>
                  <span className={styles.detailItemValue}>
                    {details.floorNew} Etage
                  </span>
                </div>
              </div>
              {details.customers.length > 1 && (
                <div className={styles.guests}>
                  <div className={styles.guestsHead}>
                    <h2>Guests</h2>
                  </div>
                  <div className={styles.guestsInner}>
                    {details.customers.map((guest, index) => (
                      <div className={styles.guestsCol}>
                        <p className={styles.guestCount}>Guest {index + 1}</p>
                        <p className={styles.guestItem}>
                          <div className={styles.guestItemLabel}>
                            {guest.name}
                          </div>
                          <div className={styles.guestItemValue}>{kind}</div>
                        </p>
                        <p className={styles.guestItem}>
                          <div className={styles.guestItemLabel}>Email</div>
                          <div className={styles.guestItemValue}>
                            {guest.email}
                          </div>
                        </p>
                        <p className={styles.guestItem}>
                          <div className={styles.guestItemLabel}>
                            Telefon number
                          </div>
                          <div className={styles.guestItemValue}>
                            {guest.phone}
                          </div>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.empty}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetails;
