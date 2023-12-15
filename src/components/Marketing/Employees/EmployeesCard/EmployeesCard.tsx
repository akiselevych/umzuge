import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
//redux
import { useDispatch, useSelector } from "react-redux";
import { deleteEmployee } from "reduxFolder/slices/marketingEmployees.slice";
//type
import { IEmployee } from "types/marketing";
import { AppDispatch, RootStateType } from "types/index";

const EmployeesCard: FC<IEmployee> = ({ id, image, name, position }) => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteEmployeesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingEmployees.deleteEmployeesLoadingStatus
  );
  const [deleteBtnValue, setDeleteBtnValue] = useState<"loading..." | "Delete">(
    "Delete"
  );
  const navigate = useNavigate();

  const onEdit = () => {
    const query = new URLSearchParams();
    query.set("employeeId", id.toString());
    query.delete("employeeAddNew");

    navigate({
      pathname: window.location.pathname,
      search: query.toString(),
    });
  };
  const onDelete = () => {
    setDeleteBtnValue("loading...");
    dispatch(deleteEmployee(id));
  };

  useEffect(() => {
    if (deleteEmployeesLoadingStatus === "idle") setDeleteBtnValue("Delete");
  }, [deleteEmployeesLoadingStatus]);

  return (
    <div className={styles.card}>
      <div className={styles.dataBlock}>
        <img className={styles.image} alt={name} src={image} />
        <div className={styles.textBlock}>
          <h5 className={styles.title}>{name}</h5>
          <p className={styles.position}>{position}</p>
        </div>
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

export default EmployeesCard;
