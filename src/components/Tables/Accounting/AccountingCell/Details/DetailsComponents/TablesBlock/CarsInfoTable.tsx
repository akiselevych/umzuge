import { FC } from "react"
import styles from "./TablesBlockk.module.scss"
import { contractCarsInfoType } from "types/tables"

type PropsType = {
  car_info: contractCarsInfoType
}

const CarsInfoTable: FC<PropsType> = ({ car_info }) => {
  const Cars = Object.keys(car_info).map((c, i) => {
    const car = car_info[c as keyof typeof car_info]

    return (
      <div
        key={i}
        className={styles.row}
        style={{ gridTemplateColumns: "3fr 2fr 2fr" }}
      >
        <div className={styles.cell}>{c}</div>
        <div className={styles.cell}>{car.daily_wage}</div>
        <div className={styles.cell}>{car.amount}</div>
      </div>
    )
  })
  return (
    <div className={styles.table}>
      <div className={styles.row} style={{ gridTemplateColumns: "3fr 2fr 2fr" }}>
        <div className={styles.cellName}>Namen</div>
        <div className={styles.cellName}>Tagessatz</div>
        <div className={styles.cellName}>Anzahl</div>
      </div>
      {Cars}
    </div>
  )
}

export default CarsInfoTable
