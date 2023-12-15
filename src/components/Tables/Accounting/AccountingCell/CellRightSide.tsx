import { FC } from "react"
import { IOffer, SentStatusType } from "types/offers"
import styles from "./AccountingCell.module.scss"
import { IContract } from "types/tables"
import moment from "moment"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types/index"
import {
  editAccountingContract,
  editAccountingOffer,
} from "reduxFolder/slices/Accounting.slice"

type PropsType = {
  item_type: "offer" | "contract"
  id: number
  sent_status: SentStatusType
  sent_date: string | null | undefined
  paid_date: string | null | undefined
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CellRightSide: FC<PropsType> = (props) => {
  const { id, item_type, paid_date, sent_date, sent_status, setIsDetailsOpen } =
    props

  const dispatch = useDispatch<AppDispatch>()
  const rightSideVariants: Record<SentStatusType, JSX.Element> = {
    TO_SEND: (
      <div className={styles.buttons}>
        <button onClick={() => setIsDetailsOpen((prev) => !prev)}>Siehe</button>
        <button
          onClick={() =>
            handleStatusChange(item_type === "offer" ? "FINAL_SEND" : "SENT")
          }
        >
          Gesendet
        </button>
      </div>
    ),
    FINAL_SEND: (
      <div className={styles.buttons}>
        <button onClick={() => setIsDetailsOpen((prev) => !prev)}>Siehe</button>
        <button onClick={() => handleStatusChange("SENT")}>Gesendet</button>
      </div>
    ),
    SENT: (
      <div className={styles.confirmPayment}>
        <label>
          <input
            type="checkbox"
            checked={false}
            onClick={() => handleStatusChange("ARCHIVE")}
            readOnly
          />
          Zahlung eingegangen
        </label>
      </div>
    ),
    ARCHIVE: (
      <div className={styles.blocks}>
        <div className={styles.block}>
          <div className={styles.name}>Rechnung verschickt:</div>
          <div className={styles.value}>
            {sent_date ? moment(sent_date).format("DD/MM/YYYY") : "-"}
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.name}>Zahlung erhalten:</div>
          <div className={styles.value}>
            {paid_date ? moment(paid_date).format("DD/MM/YYYY") : "-"}
          </div>
        </div>
      </div>
    ),
  }

  function handleStatusChange(status: SentStatusType) {
    const newData: Omit<Partial<IContract | IOffer>, "price"> = {
      sent_status: status,
    }
    if (status === "SENT") {
      newData.sent_date = moment().format("YYYY-MM-DD")
    } else if (status === "ARCHIVE") {
      newData.paid_date = moment().format("YYYY-MM-DD")
    }
    if (item_type === "offer") {
      dispatch(
        editAccountingOffer({
          id: id,
          new_offer_data: newData,
        })
      )
    } else {
      dispatch(
        editAccountingContract({
          id: id,
          new_contract_data: newData,
        })
      )
    }
  }

  return rightSideVariants[sent_status]
}

export default CellRightSide
