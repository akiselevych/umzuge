import { FC } from "react"
import tableStyles from "../DetailsComponents/TablesBlock/TablesBlockk.module.scss"
import styles from "./CompaniesBlock.module.scss"
import classNames from "classnames"
import { workerTypeDictionary } from "components/Calendar/DayCalendar/OffersDayCalendar/ItemsToSelect/ExternalPopUp"

type PropsType = {
  items: { name: string; amount: number }[]
}

const Table: FC<PropsType> = ({ items }) => {
  const ItemsComponents = items.map((item, i) => (
    <div
      key={i}
      className={tableStyles.row}
      style={{ gridTemplateColumns: "3fr 2fr" }}
    >
      <div className={classNames(tableStyles.cell, styles.tableNameCell)}>
        {workerTypeDictionary[item.name as keyof typeof workerTypeDictionary] ??
          "Unbekannt"}
      </div>
      <div className={classNames(tableStyles.cell, styles.tableAmountCell)}>
        {item.amount}
      </div>
    </div>
  ))

  return (
    <div className={tableStyles.table}>
      <div className={tableStyles.row} style={{ gridTemplateColumns: "3fr 2fr" }}>
        <div className={classNames(tableStyles.cellName, styles.tableNameCell)}>
          Namen
        </div>
        <div className={classNames(tableStyles.cellName, styles.tableAmountCell)}>
          Anzahl
        </div>
      </div>
      {ItemsComponents}
    </div>
  )
}

export default Table
