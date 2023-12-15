import moment from "moment"
import { FC } from "react"
import { IContract } from "types/tables"

type PropsType = {
  contract: IContract
  setIsModalOpen: (value: boolean) => void
  setCurrentContractId: (value: number | null) => void
}

const Contract: FC<PropsType> = ({
  contract,
  setIsModalOpen,
  setCurrentContractId,
}) => {
  function handleOpen() {
    setIsModalOpen(true)
    setCurrentContractId(contract.id)
  }

  return (
    <tr onClick={handleOpen}>
      <td>{contract.firm || "-"}</td>
      <td>{contract.start_address || "-"}</td>
      <td>{contract.end_address || "-"}</td>
      <td>{contract.date ? moment(contract.date).format("DD-MM-YYYY") : "-"}</td>
    </tr>
  )
}

export default Contract
