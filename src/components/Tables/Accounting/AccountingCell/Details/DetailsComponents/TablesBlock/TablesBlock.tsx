import { FC } from "react"
import styles from "./TablesBlockk.module.scss"
import detailsContentStyles from "../../CellDetailsContent.module.scss"
import CarsInfoTable from "./CarsInfoTable"
import { contractCarsInfoType, contractWorkersInfoType } from "types/tables"
import WorkersInfoTable from "./WorkersInfoTable"

type PropsType = {
  workers_info: contractWorkersInfoType
  cars_info: contractCarsInfoType
}

const TablesBlock: FC<PropsType> = ({ workers_info, cars_info }) => {
  return (
    <div className={styles.tablesBlock}>
      <div className={styles.tableBlock}>
        <h2 className={detailsContentStyles.subtitle}>LKW informationen</h2>
        <CarsInfoTable car_info={cars_info} />
      </div>
      <div className={styles.tableBlock}>
        <h2 className={detailsContentStyles.subtitle}>Arbeiterinformationen</h2>
        <WorkersInfoTable workers_info={workers_info} />
      </div>
    </div>
  )
}

export default TablesBlock
