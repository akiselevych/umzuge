import { FC } from "react"
import styles from "./TablesBlockk.module.scss"
import { contractWorkersInfoType } from "types/tables"

type PropsType = {
  workers_info: contractWorkersInfoType
}

const WorkersInfoTable: FC<PropsType> = ({ workers_info }) => {
  const Workers = Object.keys(workers_info).map((w, i) => {
    const worker = workers_info[w as keyof typeof workers_info]

    return (
      <div
        key={i}
        className={styles.row}
        style={{ gridTemplateColumns: "3fr 2fr 2fr 2fr" }}
      >
        <div className={styles.cell}>{w}</div>
        <div className={styles.cell}>{worker.hourly_wage}</div>
        <div className={styles.cell}>{worker.coming_fee}</div>
        <div className={styles.cell}>{worker.amount}</div>
      </div>
    )
  })
  return (
    <div className={styles.table}>
      <div className={styles.row} style={{ gridTemplateColumns: "3fr 2fr 2fr 2fr" }}>
        <div className={styles.cellName}>Namen</div>
        <div className={styles.cellName}>Stundenlohn</div>
        <div className={styles.cellName}>Anfahrtspauschale</div>
        <div className={styles.cellName}>Anzahl</div>
      </div>
      {Workers}
    </div>
  )
}

export default WorkersInfoTable
