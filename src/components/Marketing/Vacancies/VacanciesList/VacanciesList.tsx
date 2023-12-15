//components
import VacanciesCard from "../VacanciesCard/VacanciesCard";
import EmployeeWrapper from "../VacanciesWrapper/VacanciesWrapper";
//redux
import {
  fetchVacancies,
  updateVacancyOrder,
} from "reduxFolder/slices/marketingVacancies.slice";
import { useDispatch, useSelector } from "react-redux";
//livs
import { useCallback, useEffect, useMemo } from "react";
//styles
import styles from "./index.module.scss";
//types
import { AppDispatch, RootStateType } from "types/index";

const VacanciesList = () => {
  const vacancies = useSelector(
    (state: RootStateType) => state.marketingVacancies.vacancies
  );
  const fetchVacanciesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingVacancies.fetchVacanciesLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchVacancies());
    //eslint-disable-next-line
  }, []);

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = vacancies.find((item) => item.order === dragOrder);
      const hoverItem = vacancies.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updateVacancyOrder({
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
    [vacancies]
  );

  const content =
    vacancies && fetchVacanciesLoadingStatus === "idle"
      ? vacancies.map((vacancy, index) => (
          <EmployeeWrapper
            vacancy={vacancy}
            moveItem={moveItem}
            key={vacancy.id}
          >
            <VacanciesCard key={index} {...vacancy} />
          </EmployeeWrapper>
        ))
      : null;
  const error =
    fetchVacanciesLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchVacanciesLoadingStatus === "error" ? <p>error...</p> : null;
  return (
    <div className={styles.vacanciesList}>
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default VacanciesList;
