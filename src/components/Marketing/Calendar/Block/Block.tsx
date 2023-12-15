import styles from "./index.module.scss";
import online from "assets/icons/online.svg";
import offline from "assets/icons/offline.svg";

export type IBlock = {
  status: "online" | "offline";
  meetingDuration: number;
  name: string;
  onActionClick: () => void;
};

const Block = ({ status, meetingDuration, name, onActionClick }: IBlock) => {
  return (
    <div className={styles.block}>
      <div
        style={{ backgroundColor: status === "online" ? "#00538E" : "#D4ECF3" }}
        className={styles.headFill}
      ></div>
      <div className={styles.content}>
        <div className={styles.image}>
          <img src={status === "online" ? online : offline} />
        </div>
        <div className={styles.text}>
          <div className={styles.status}>
            <p>{name}</p>
          </div>

          <p className={styles.duration}>
            {meetingDuration} hour {status} meeting
          </p>
        </div>
      </div>

      <hr className={styles.hr} />
      <div className={styles.buttons}>
        <button onClick={onActionClick}>View</button>
        <button onClick={onActionClick}>Edit</button>
      </div>
    </div>
  );
};

export default Block;
