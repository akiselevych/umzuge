//libs
import { FC } from "react";
//components
import CarsList from "./CarsList/CarsList";
//styles
import styles from "./CompanyCarTable.module.scss";

interface Props {
  cars: {
    id: string | number,
    name: string,
    wage: string
  }[],
  companyId: string | number
}

const CompanyCarTable: FC<Props> = ({ cars, companyId }) => {

  return (
    <div
      className={styles.table}
    >
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderTitle}>
          Liste der Fahrzeuge
        </div>
      </div>
      {!cars && <p>No data</p>}
      {cars && <CarsList companyId={companyId} cars={cars} />}
    </div>
  );
};

export default CompanyCarTable;
