//libs
import { FC } from "react";
import { useDispatch } from "react-redux";
//components
import WorkerTableItem from "../WorkerTableItem/WorkerTableItem";
//redux
import { editCompany } from "reduxFolder/slices/Table.slice";
//styles
import styles from "./WorkersList.module.scss";
//types
import { AppDispatch } from "types";

interface Props {
  workersData: {
    "id": string | number,
    "name": string
    "goingFee": string
    "comingFee": string
    "hourlyWage": string
  }[],
  companyId: string | number
}


const WorkersList: FC<Props> = ({ workersData, companyId }) => {
  const dispatch = useDispatch<AppDispatch>();


  const onUpdateList = (id: string | number, data: {
    "name": string
    "goingFee": string
    "comingFee": string
    "hourlyWage": string
  }) => {
    const updatedList = workersData.map((worker) => {
      if (worker.id === id) {
        return {
          ...worker,
          ...data
        }
      }
      return worker
    })
    console.log(updatedList)
    dispatch(editCompany({
      id: companyId,
      data: {
        workers_info: updatedList
      }
    }))
  }


  return (
    <>
      <ul className={styles.tableList}>
        <li className={styles.tableListItem}>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Namen
          </p>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Stundenlöhne
          </p>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Anfahrtspauschale
          </p>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Abfahrtspauschale
          </p>
        </li>
        {workersData.map((worker) => (
          <WorkerTableItem
            onUpdateList={onUpdateList}
            name={worker.name}
            hourlyWage={worker.hourlyWage}
            comingFee={worker.comingFee}
            goingFee={worker.goingFee}
            id={worker.id}
            key={worker.id}
          />
        ))}
      </ul>
    </>
  );
};

export default WorkersList;
