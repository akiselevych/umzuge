import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
//redux
import { useDispatch, useSelector } from "react-redux";
import { deleteVacancy } from "reduxFolder/slices/marketingVacancies.slice";
//type
import { IVacancy } from "types/marketing";
import { AppDispatch, RootStateType } from "types/index";

const VacanciesCard: FC<IVacancy> = ({
  date,
  job_title,
  employment_type,
  id,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteVacanciesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingVacancies.deleteVacanciesLoadingStatus
  );
  const [deleteBtnValue, setDeleteBtnValue] = useState<"loading..." | "Delete">(
    "Delete"
  );
  const navigate = useNavigate();

  const onEdit = () => {
    const query = new URLSearchParams();
    query.set("vacancyId", id.toString());
    query.delete("vacancyAddNew");

    navigate({
      pathname: window.location.pathname,
      search: query.toString(),
    });
  };
  const onDelete = () => {
    setDeleteBtnValue("loading...");
    dispatch(deleteVacancy(id));
  };

  useEffect(() => {
    if (deleteVacanciesLoadingStatus === "idle") setDeleteBtnValue("Delete");
  }, [deleteVacanciesLoadingStatus]);

  return (
    <div className={styles.card}>
      <div className={styles.dataBlock}>
        <div className={styles.topRow}>
          <h5 className={styles.title}>{job_title}</h5>
          <p className={styles.type}>{employment_type}</p>
        </div>
        <p className={styles.date}>{date}</p>
      </div>
      <div className={styles.btnsBlock}>
        <button onClick={onDelete} className={general.primaryButton}>
          {deleteBtnValue}
        </button>
        <button onClick={onEdit} className={general.secondaryButton}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default VacanciesCard;
