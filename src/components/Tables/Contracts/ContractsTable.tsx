import ModalWindow from "components/ModalWindow/ModalWindow"
import ContractOverview from "components/Overview/contractOverview/ContractOverview"
import { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCompanies } from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import { IContract } from "types/tables"
import { v1 } from "uuid"
import Contract from "./Contract"
import styles from "../Tables.module.scss"
import LoadMoreButton from "components/LoadMoreButton/LoadMoreButton"

type ContractsHeadersType = {
  [K in keyof Partial<Omit<IContract, "id" | "status" | "pdf_file">>]: string
}

export const contractsHeadersNames: ContractsHeadersType = {
  firm: "Firma",
  start_address: "Startadresse",
  end_address: "Endadresse",
  date: "Datum",
}

export const contractFields: Partial<Record<keyof IContract, string>> = {
  firm: "Firma",
	customer_name: "Kunde",
  email: "E-Mail",
  cars_info: "LKW Informationen",
  phone: "Telefone",
  workers_info: "Arbeiterinformationen",
  date: "Datum",
  start_time: "Startzeit",
  start_address: "Startadresse",
  end_time: "Endzeit",
  end_address: "Endadresse",
}

const ContractsTable: FC<{ table: IContract[] }> = ({ table }) => {
  const dispatch = useDispatch<AppDispatch>()

  const isLoading = useSelector((state: RootStateType) => state.Table.isLoading)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentContractId, setCurrentContractId] = useState<number | null>(null)
  const currentContract = table.find((c) => c.id === currentContractId)

  useEffect(() => {
    dispatch(getCompanies())
  }, [])

  if (isLoading) return <div className={styles.stateMessage}>Laden...</div>
  if (!table || table.length === 0)
    return <div className={styles.stateMessage}>keine Personaldienstleistungen</div>

  const Headers = Object.keys(contractsHeadersNames).map((h) => {
    return (
      <th key={v1()}>
        {contractsHeadersNames[h as keyof typeof contractsHeadersNames]}
      </th>
    )
  })

  const Contracts = table.map((contract) => (
    <Contract
      key={contract.id}
      contract={contract}
      setIsModalOpen={setIsModalOpen}
      setCurrentContractId={setCurrentContractId}
    />
  ))

  return (
    <div>
      <table className={styles.contracts}>
        <thead>
          <tr>{Headers}</tr>
        </thead>
        <tbody>{Contracts}</tbody>
      </table>
      <div className={styles.loadMore}>
        <LoadMoreButton item="contracts" />
      </div>

      <ModalWindow
        size="small"
        withLogo={true}
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
      >
        <ContractOverview
          contract={currentContract as IContract}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalWindow>
    </div>
  )
}

export default ContractsTable
