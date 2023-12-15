import classNames from "classnames"
import { FC, useEffect } from "react"
import styles from "components/TablesList/TablesList.module.scss"
import { useActions } from "hooks/useActions"
import { TableItemProps, TableNameType } from "types/tables"
import { useSelector } from "react-redux"
import { RootStateType } from "types"

export const tablesNamesDict = {
  Employees: "Mitarbeiter",
  Leads: "Leads",
  Orders: "Angebote",
  Offers: "Aufträge",
  Contracts: "Personaldienst leistungen",
}

const TablesList: FC<TableItemProps> = ({ currentTableName }) => {
  const user = useSelector((state: RootStateType) => state.User.user)
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )

  const { setCurrentTableName } = useActions()

  useEffect(() => {
    if (currentWorkflow === "SaleMan" && currentTableName === "Employees") {
      setCurrentTableName("Leads")
    }
  }, [currentWorkflow])

  const tablesNames = Object.keys(tablesNamesDict).filter((n) =>
    user?.role === "sale_man" || currentWorkflow === "SaleMan"
      ? n !== "Employees"
      : n
  )
  const TablesList = tablesNames.map((n, i) => (
    <div
      key={i}
      className={
        n === currentTableName
          ? classNames(styles.tableName, styles.current)
          : styles.tableName
      }
      onClick={() => setCurrentTableName(n as TableNameType)}
    >
      {tablesNamesDict[n as keyof typeof tablesNamesDict]}
    </div>
  ))

  return <div className={styles.tableList}>{TablesList}</div>
}

export default TablesList
