//libs
import { FC } from "react";
//components
import WorkersList from "./WorkersList/WorkersList";
//styles
import styles from "./CompanyWorkersTable.module.scss";

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


const CompanyWorkersTable: FC<Props> = ({ workersData, companyId }) => {
  return (
    <div
      className={styles.table}
    >
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderTitle}>
          Arbeiterliste
        </div>
      </div>
      {!workersData && <p>No data</p>}
      {workersData && <WorkersList companyId={companyId} workersData={workersData} />}
    </div>
  );
};

export default CompanyWorkersTable;
