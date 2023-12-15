import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import { FC, useEffect, useRef, useState } from "react";
// Styles
import "styles/index.scss";
import styles from "./Complaints.module.scss";
// Icons
import sliderHorizontal from "assets/icons/slider.horizontal.3.svg";
import arrowIcon from "assets/icons/arrow.svg";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "reduxFolder/slices/User.slice";
// Types
import { AppDispatch, RootStateType } from "types";
import Message from "./Message/Message";
import Notification from "components/Notification/Notification";
import { getVacations } from "reduxFolder/slices/Calendar.slice";
import Vacation from "./Message/Vacation";
import { v1 } from "uuid";

const filtersNames = ["Urlaubsanfrage", "Materialanfrage", "Disposition"];

const Complaints: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getMessages());
    dispatch(getVacations());
  }, []);
  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter((prevFilter) =>
      prevFilter === filter ? null : filter
    );
  };

  const user = useSelector((state: RootStateType) => state.User.user);
  const allMessagesData = useSelector(
    (state: RootStateType) => state.User.messages
  );
  const messagesData = allMessagesData?.filter(
    (m) => m.from_user.id !== user?.id
  );

  const Messages = messagesData
    ?.filter((m) => {
      if (selectedFilter === null) {
        return true; // No filter, include all messages
      } else if (selectedFilter === "Disposition") {
        return m.title === null;
      } else {
        return m.title === selectedFilter;
      }
    })
    .map((m) => (
      <Message
        key={m.id}
        message={m}
        setIsNotifivationVisible={setIsNotifivationVisible}
      />
    ));
    

  const vacations = useSelector(
    (state: RootStateType) => state.Calendar.vacations
  );
  const Vacations = vacations
    ?.filter((v) => {
      if (selectedFilter === null) {
        return true; // No filter, include all vacations
      } else if (selectedFilter === "Urlaubsanfrage") {
        return v;
      }
    })
    .map((v) => (
      <Vacation
        key={v1()}
        vacation={v}
        setIsNotifivationVisible={setIsNotifivationVisible}
      />
    ));

  const MessagesVacations = [...(Messages ?? []), ...(Vacations ?? [])].sort(
    (a, b) => {
      const paramA = a.props.message?.date_time ?? a.props.vacation?.created_at;
      const paramB = b.props.message?.date_time ?? b.props.vacation?.created_at;
      if (paramA > paramB) {
        return -1;
      }
      if (paramA < paramB) {
        return 1;
      }
      return 0;
    }
  );

  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const { register, handleSubmit, watch } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  const watchFilter = watch();
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [watchFilter]);

  const Filters = filtersNames.map((f, i) => (
    <label key={i} className={styles.filter}>
      <input
        type="checkbox"
        {...register(f)}
        onChange={() => handleFilterChange(f)}
        checked={selectedFilter === f}
      />
      {f}
    </label>
  ));

  const complaintsRef = useRef<HTMLDivElement>(null);
  const filtersPopUpRef = useRef(null);
  useEffect(() => {
    function closeFilters(e: MouseEvent) {
      if (
        isFilterOpened &&
        (e.target as HTMLElement).closest("div") !== filtersPopUpRef.current
      ) {
        setIsFilterOpened(false);
      }
    }
    complaintsRef.current?.addEventListener("click", closeFilters);

    return () =>
      complaintsRef.current?.removeEventListener("click", closeFilters);
  }, [isFilterOpened]);

  return (
    <div className={styles.complaints} ref={complaintsRef}>
      <div className={styles.header}>
        <h1 className="modalTitle">Reklamationen</h1>
        <button
          className="filterButton"
          onClick={() => setIsFilterOpened(true)}
        >
          Filter <img src={sliderHorizontal} alt="sliderHorizontal" />
        </button>
        <div
          className={
            isFilterOpened
              ? styles.filtersPopUp
              : classNames(styles.filtersPopUp, styles.hidden)
          }
          ref={filtersPopUpRef}
        >
          <form onSubmit={handleSubmit(onSubmit)} className={styles.filters}>
            {Filters}
          </form>
          <button
            className={styles.close}
            onClick={() => setIsFilterOpened(false)}
          >
            <img src={arrowIcon} alt="close" />
          </button>
        </div>
      </div>
      <div className={styles.messages}>
        {allMessagesData && vacations
          ? messagesData?.length !== 0 || vacations?.length !== 0
            ? MessagesVacations
            : "Keine Meldungen"
          : "Laden..."}
      </div>
      <div className={styles.notification}>
        <Notification
          text="Die Nachricht wurde gesendet!"
          isVisible={isNotifivationVisible}
          setIsvisible={setIsNotifivationVisible}
        />
      </div>
    </div>
  );
};

export default Complaints;
