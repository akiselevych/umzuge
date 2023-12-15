import { contractFields } from "components/Tables/Contracts/ContractsTable"
import moment from "moment"
import { FC, useEffect, useState } from "react"
import { IContract } from "types/tables"
import styles from "./ContractOverview.module.scss"
import { UseFormSetValue } from "react-hook-form"
import { FormValues } from "./ContractOverview"
import WorkersInfoTable from "./InputTables/WorkersInfoTable"
import CarsInfoTable from "./InputTables/CarsInfoTable"
import ModalTableField from "./ModalTableField"
import { getFormattedTime } from "utils/getFormattedTime"

type PropsType = {
  contract: IContract
  property: keyof IContract
  watchFields: FormValues
  setValue: UseFormSetValue<FormValues>
}

const TextField: FC<PropsType> = ({ property, contract, setValue, watchFields }) => {
  if (!contract) return null

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [isInfoModalOpen])

  let Property = <>{contract[property] || "-"}</>
  if (property === "date") {
    Property = <>{moment(contract[property].toString()).format("DD-MM-YYYY")}</>
  } else if (property === "workers_info") {
    Property = (
      <ModalTableField
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        name="Arbeiterinformationen"
      >
        <WorkersInfoTable
          workersInfo={watchFields.workers_info}
          setValue={setValue}
          disabled
        />
      </ModalTableField>
    )
  } else if (property === "cars_info") {
    Property = (
      <ModalTableField
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        name="LKW Informationen"
      >
        <CarsInfoTable
          carsInfo={watchFields.cars_info}
          setValue={setValue}
          disabled
        />
      </ModalTableField>
    )
  } else if (property === "start_time" || property === "end_time") {
    Property = <>{getFormattedTime(contract[property])}</>
  }

  return (
    <div className={styles.field}>
      <div className={styles.name}>
        {property !== "cars_info" &&
          property !== "workers_info" &&
          contractFields[property as keyof typeof contractFields]}
      </div>
      <div className={styles.value}>{Property}</div>
    </div>
  )
}

export default TextField
