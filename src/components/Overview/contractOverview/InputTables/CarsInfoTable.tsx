import { FC } from "react"
import styles from "./WorkersPricesTable.module.scss"
import { UseFormSetValue } from "react-hook-form"
import { FormValues } from "../ContractOverview"
import { contractCarsInfoType } from "types/tables"
import InputCell from "./InputCell"

type PropsType = {
  carsInfo: contractCarsInfoType
  setValue: UseFormSetValue<FormValues>
  disabled?: boolean
}

const CarsInfoTable: FC<PropsType> = ({ carsInfo, setValue, disabled }) => {
  const Cars = Object.keys(carsInfo).map((c, i) => {
    const car = carsInfo[c as keyof typeof carsInfo]

    const dailyFieldName = `cars_info.${c}.daily_wage`
    const amountFieldName = `cars_info.${c}.amount`

    function handleDailyWageChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(dailyFieldName as any, +e.target.value)
    }
    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(amountFieldName as any, +e.target.value)
    }

    return (
      <div
        key={i}
        className={styles.row}
        style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div className={styles.cell}>{c}</div>
        <InputCell
          value={car.daily_wage}
          handleChange={handleDailyWageChange}
          disabled={disabled}
        />
        <InputCell
          value={car.amount}
          handleChange={handleAmountChange}
          disabled={disabled}
        />
      </div>
    )
  })

  return (
    <div className={styles.wrapper}>
      <h1 className="modalTitle">LKWliste</h1>
      <div className={styles.table}>
        <div className={styles.row} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className={styles.cell}>Namen</div>
          <div className={styles.cell}>Tagessatz</div>
          <div className={styles.cell}>Anzahl</div>
        </div>
        {Cars}
      </div>
    </div>
  )
}

export default CarsInfoTable
