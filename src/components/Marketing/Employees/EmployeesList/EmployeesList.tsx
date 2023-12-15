//components
import VacanciesCard from "../EmployeesCard/EmployeesCard";
import EmployeeWrapper from "../EmployeeWrapper/EmployeeWrapper";
//redux
import {
  fetchEmployees,
  updateEmployeeOrder,
} from "reduxFolder/slices/marketingEmployees.slice";
import { useDispatch, useSelector } from "react-redux";
//livs
import { useCallback, useEffect } from "react";
//styles
import styles from "./index.module.scss";
//types
import { AppDispatch, RootStateType } from "types/index";

const EmployeesList = () => {
  const employees = useSelector(
    (state: RootStateType) => state.marketingEmployees.employees
  );
  const fetchEmployeesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingEmployees.fetchEmployeesLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchEmployees());
    //eslint-disable-next-line
  }, []);

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = employees.find((item) => item.order === dragOrder);
      const hoverItem = employees.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updateEmployeeOrder({
            dragItem: {
              id: dragItem.id,
              order: dragOrder,
            },
            hoverItem: {
              id: hoverItem.id,
              order: hoverOrder,
            },
          })
        );
      }
    },
    [employees]
  );

  const content =
    employees && fetchEmployeesLoadingStatus === "idle"
      ? employees.map((vacancy, index) => (
          <EmployeeWrapper
            employee={vacancy}
            moveItem={moveItem}
            key={vacancy.id}
          >
            <VacanciesCard key={index} {...vacancy} />
          </EmployeeWrapper>
        ))
      : null;
  const error =
    fetchEmployeesLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchEmployeesLoadingStatus === "error" ? <p>error...</p> : null;

  return (
    <div className={styles.vacanciesList}>
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default EmployeesList;
