import classNames from "classnames"
import styles from "./TablesList.module.scss"
import { FC } from "react"
import { useSelector } from "react-redux"
import { RootStateType } from "types/index"
import { useActions } from "hooks/useActions"
import { SentStatusType } from "types/offers"

export const accountingTablesNamesDict: Record<SentStatusType, string> = {
  TO_SEND: "Zu versenden",
  FINAL_SEND: "Schlussrechnung",
  SENT: "Versendet",
  ARCHIVE: "Archiv",
}

const AccountingTablesList: FC = () => {
  const tableItem = useSelector((state: RootStateType) => state.Accounting.tableItem)
  const currentTableName = useSelector(
    (state: RootStateType) => state.Accounting.currentAccountingTableName
  )

  const { setCurrentAccountingTableName } = useActions()

  const tableListNames = Object.keys(accountingTablesNamesDict).filter((key) => {
    if (tableItem === "Personaldienstleistungen") {
      return key !== "FINAL_SEND"
    }
    return true
  })

  const TablesList = tableListNames.map((n, i) => (
    <div
      key={i}
      className={
        n === currentTableName
          ? classNames(styles.tableName, styles.current)
          : styles.tableName
      }
      onClick={() => setCurrentAccountingTableName(n as SentStatusType)}
			style={{maxWidth: 'none', whiteSpace: 'nowrap'}}
    >
      {accountingTablesNamesDict[n as keyof typeof accountingTablesNamesDict]}
    </div>
  ))
  return (
    <div className={styles.tableList} style={{ maxWidth: 150 }}>
      {TablesList}
    </div>
  )
}

export default AccountingTablesList
