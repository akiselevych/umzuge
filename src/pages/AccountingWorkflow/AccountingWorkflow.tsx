import { FC, useEffect } from "react"
import styles from "./AccountingWorkflow.module.scss"
import AccountingTablesList from "components/TablesList/AccountingTablesList"
import AccountingTable from "components/Tables/Accounting/AccountingTable"
import searchIcon from "assets/icons/search.svg"
import ToggleState from "components/ToggleState/ToggleState"
import { useSelector } from "react-redux"
import { RootStateType } from "types/index"
import { useActions } from "hooks/useActions"
import CalendarHeader from "components/Calendar/CalendarHeader/CalendarHeader"
import moment from "moment"

const AccountingWorkflow: FC = () => {
  const tableItem = useSelector((state: RootStateType) => state.Accounting.tableItem)

  const search = useSelector((state: RootStateType) => state.Accounting.search)
  const { setAccountingSearch, setCurrentDate, setAccountingTableItem } =
    useActions()

  useEffect(() => {
    setCurrentDate(moment().format("YYYY-MM-DD"))
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setAccountingSearch(e.target.value)
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <CalendarHeader />
      <div className={styles.header}>
        <div className={styles.search}>
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            placeholder="Suchen"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.toggle}>
          <ToggleState
            currentOption={tableItem}
            onToggle={(item) => setAccountingTableItem(item)}
            options={["Aufträge", "Personaldienstleistungen"]}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.tableSection}>
          <AccountingTable />
        </div>
        <AccountingTablesList />
      </div>
    </div>
  )
}

export default AccountingWorkflow
