import { FC, useEffect } from "react"
import styles from "./AccountingTable.module.scss"
import tablesStyles from "../Tables.module.scss"
import { AppDispatch, RootStateType } from "types/index"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"
import {
  getAccountingContracts,
  getAccountingItemsNextPage,
  getAccountingOffers,
} from "reduxFolder/slices/Accounting.slice"
import AccountingCell, {
  AccountingCellPropsType,
} from "./AccountingCell/AccountingCell"
import { useDebounce } from "hooks/useDebounce"
import { useActions } from "hooks/useActions"

const AccountingTable: FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    tableItem,
    isLoading,
    accountingOffers,
    accountingContracts,
    search,
    currentAccountingTableName,
    isLastPage,
  } = useSelector((state: RootStateType) => state.Accounting)
  const currentDate = useSelector(
    (state: RootStateType) => state.Calendar.currentDate
  )
  const debouncedSearch = useDebounce(search, 500)

  const contentAvailability = {
    Aufträge: accountingOffers.length > 0,
    Personaldienstleistungen: accountingContracts.length > 0,
  }
  const isContent = !isLoading && contentAvailability[tableItem]

  const { setCurrentAccountingTableName } = useActions()

  useEffect(() => {
    setCurrentAccountingTableName("TO_SEND")
  }, [tableItem])

  useEffect(() => {
    if (tableItem === "Aufträge") {
      dispatch(getAccountingOffers(currentAccountingTableName))
    } else {
      dispatch(getAccountingContracts(currentAccountingTableName))
    }
  }, [tableItem, currentAccountingTableName, debouncedSearch, currentDate])

  const AccountingOfferItems = accountingOffers.map((offer, i) => {
    const data: AccountingCellPropsType = {
      item_type: "offer",
      id: offer.id,
      number: offer.delivery_number,
      status: offer.sent_status,
      start_address: offer.start_address,
      end_address: offer.end_address,
      customer_name: `${offer.customer.first_name} ${offer.customer.last_name}`,
      price: +offer.price,
      start_date: offer.start_date,
      sent_date: offer.sent_date,
      paid_date: offer.paid_date,
      payment_comment: offer.paid_comment || "",
      pdf_file: offer.pdf_file,
    }
    return <AccountingCell key={i} {...data} />
  })
  const AccountingContractItems = accountingContracts.map((contract, i) => {
    const data: AccountingCellPropsType = {
      item_type: "contract",
      id: contract.id,
      number: contract.id,
      status: contract.sent_status,
      firm_name: contract.firm,
      customer_name: contract.customer_name,
      start_date: contract.date,
      start_address: contract.start_address,
      end_address: contract.end_address,
      contract_details: {
        start_time: contract.start_time,
        workers_info: contract.workers_info,
        cars_info: contract.cars_info,
      },
      sent_date: contract.sent_date,
      paid_date: contract.paid_date,
      price: contract.price,
      payment_comment: contract.paid_comment || "",
      pdf_file: contract.pdf_file,
    }
    return <AccountingCell key={i} {...data} />
  })

  const displaItems =
    tableItem === "Aufträge" ? AccountingOfferItems : AccountingContractItems

  if (isLoading) {
    return (
      <div className={classNames(styles.table, styles.noData)}>
        <div className={tablesStyles.stateMessage}>Laden...</div>
      </div>
    )
  }

	function loadMore() {
		dispatch(getAccountingItemsNextPage())
	}

  return (
    <div className={classNames(styles.table, !isContent && styles.noData)}>
      {isContent ? (
        <div className={styles.tableWrapper}>
          {displaItems}
          {!isLastPage && (
            <div className={styles.loadMore}>
              <button onClick={loadMore}>Mehr laden</button>
            </div>
          )}
        </div>
      ) : (
        <div className={tablesStyles.stateMessage}>Keine Daten</div>
      )}
    </div>
  )
}

export default AccountingTable
