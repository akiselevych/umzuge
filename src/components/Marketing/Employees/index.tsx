//components
import classNames from "classnames";
import EmployeesList from "./EmployeesList/EmployeesList";
import EmployeesForm from "./EmployeesForm/EmployeesForm";
//libs
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//styles
import styles from "./index.module.scss";
//images
import smallPlus from "assets/icons/smallPlus.svg";

const Employees = () => {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId");
  const employeeAddNew = searchParams.get("employeeAddNew");
  const navigate = useNavigate();

  const onAdd = () => {
    const query = new URLSearchParams();
    query.set("employeeAddNew", true.toString());
    query.delete("employeeId");

    navigate({
      pathname: window.location.pathname,
      search: query.toString(),
    });
  };

  if (employeeId || employeeAddNew) return <EmployeesForm />;

  return (
    <div className={styles.container}>
      <button
        onClick={onAdd}
        className={classNames(styles.primaryButton, styles.addBtn)}
      >
        Add <img src={smallPlus} />
      </button>
      <EmployeesList />
    </div>
  );
};

export default Employees;
