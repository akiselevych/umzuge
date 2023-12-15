import { FC } from "react"
import styles from "./WorkersPricesTable.module.scss"
import { contractWorkersInfoType } from "types/tables"
import { UseFormSetValue } from "react-hook-form"
import { FormValues } from "../ContractOverview"
import InputCell from "./InputCell"

export const workerTypes = [
  "Fachkraft/Träger",
  "Monteur",
  "LKW Fahrer 3,5t",
  "LKW Fahrer ab 7,5t",
]

type PropsType = {
  workersInfo: contractWorkersInfoType
  setValue: UseFormSetValue<FormValues>
  disabled?: boolean
}

const WorkersInfoTable: FC<PropsType> = ({ workersInfo, setValue, disabled }) => {
  const Workers = Object.keys(workersInfo).map((w, i) => {
    const worker = workersInfo[w as keyof typeof workersInfo]

    const hourlyFieldName = `workers_info.${w}.hourly_wage`
    const comingFeeFieldName = `workers_info.${w}.coming_fee`
    const amountFieldName = `workers_info.${w}.amount`
    function handleHourlyWageChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(hourlyFieldName as any, +e.target.value)
    }
    function handleComingFeeChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(comingFeeFieldName as any, +e.target.value)
    }
    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(amountFieldName as any, +e.target.value)
    }

    return (
      <div key={i} className={styles.row}>
        <div className={styles.cell}>{w}</div>
        <InputCell
          value={worker.hourly_wage}
          handleChange={handleHourlyWageChange}
          disabled={disabled}
        />
        <InputCell
          value={worker.coming_fee}
          handleChange={handleComingFeeChange}
          disabled={disabled}
        />
        <InputCell
          value={worker.amount}
          handleChange={handleAmountChange}
          disabled={disabled}
        />
      </div>
    )
  })

  return (
    <div className={styles.wrapper}>
      <h1 className="modalTitle">Arbeiterliste</h1>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.cell}>Namen</div>
          <div className={styles.cell}>Stundenlohn</div>
          <div className={styles.cell}>Anfahrtspauschale</div>
          <div className={styles.cell}>Anzahl</div>
        </div>
        {Workers}
      </div>
    </div>
  )
}

export default WorkersInfoTable
