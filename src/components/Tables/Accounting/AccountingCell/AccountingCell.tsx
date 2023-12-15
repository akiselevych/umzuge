import { FC, useState } from "react"
import styles from "./AccountingCell.module.scss"
import CellsBlock from "./CellBlock"
import { SentStatusType } from "types/offers"
import CellDetails from "./Details/CellDetails"
import { contractCarsInfoType, contractWorkersInfoType } from "types/tables"
import {
  initialCarsInfo,
  initialWorkersInfo,
} from "components/Overview/contractOverview/ContractOverview"
import CellRightSide from "./CellRightSide"
import { ContractDetailsMainInfoPropsType } from "./Details/DetailsComponents/MainInfoBlock"

export type AccountingCellPropsType = {
  item_type: "offer" | "contract"
  id: number
  number: string | number
  status: SentStatusType
  firm_name?: string
  customer_name: string
  price: number | null
  start_address: string
  end_address: string
  start_date: string
  contract_details?: {
    start_time: string
    workers_info: contractWorkersInfoType
    cars_info: contractCarsInfoType
  }
  sent_date: string | null | undefined
  paid_date: string | null | undefined
  payment_comment: string
  pdf_file: string | null
}

export type ContractDetailsPropsType = {
  main_info: ContractDetailsMainInfoPropsType
  workers_info: contractWorkersInfoType
  cars_info: contractCarsInfoType
  price: number | null
  id: number
  payment_comment: string
  pdf_file: string | null
}
export type OfferDetailsPropsType = {
  main_info: ContractDetailsMainInfoPropsType
  customer_name: string
  price: number | null
  address: string
  start_date: string
  id: number
  payment_comment: string
  pdf_file: string | null
}

const AccountingCell: FC<AccountingCellPropsType> = (props) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const offerDetailsProps: OfferDetailsPropsType = {
    main_info: {
      customer_name: props.customer_name || "-",
      date: props.start_date || "-",
      start_address: props.start_address || "-",
      end_address: props.end_address || "-",
    },
    customer_name: props.customer_name || "-",
    address: props.start_address || "-",
    start_date: props.start_date || "-",
    price: props.price || null,
    id: props.id,
    payment_comment: props.payment_comment,
    pdf_file: props.pdf_file,
  }
  const contractDetailsProps: ContractDetailsPropsType = {
    main_info: {
      customer_name: props.customer_name || "-",
      date: props.start_date || "-",
      start_time: props.contract_details?.start_time || "-",
      start_address: props.start_address || "-",
      end_address: props.end_address || "-",
    },
    cars_info: props.contract_details?.cars_info || initialCarsInfo,
    workers_info: props.contract_details?.workers_info || initialWorkersInfo,
    price: props.price || null,
    id: props.id,
    payment_comment: props.payment_comment,
    pdf_file: props.pdf_file,
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cell}>
        <div className={styles.info}>
          <div className={styles.title}>
            Bestätigung der Bestellung - Nummer {props.number}
          </div>
          <div className={styles.content}>
            <CellsBlock
              firm_name={props.firm_name}
              customer_name={props.customer_name}
              price={props.price}
              address={props.start_address}
            />
            <CellRightSide
              id={props.id}
              item_type={props.item_type}
              paid_date={props.paid_date}
              sent_date={props.sent_date}
              sent_status={props.status}
              setIsDetailsOpen={setIsDetailsOpen}
            />
          </div>
        </div>
      </div>

      {(props.status === "TO_SEND" || props.status === "FINAL_SEND") && (
        <CellDetails
          item_type={props.item_type}
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          offerDetailsProps={offerDetailsProps}
          contractDetailsProps={contractDetailsProps}
          number={props.number}
        />
      )}
    </div>
  )
}

export default AccountingCell
