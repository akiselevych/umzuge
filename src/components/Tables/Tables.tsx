// Libs
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getContracts, getLeads, getOffers } from "reduxFolder/slices/Table.slice"
// Styles
import styles from "components/Tables/Tables.module.scss"
// Types
import {
  ContractDisplayCategoriesType,
  LeadDisplayCategoriesType,
  OfferDisplayCategoriesType,
  TableItemProps,
  TableNameType,
} from "types/tables"
import { AppDispatch, RootStateType } from "types"
// Components
import LeadsTable from "./Leads/LeadsTable"
import EmployeesTable from "./Employees/EmployeesTable"
import OffersTable from "./Offers/OffersTable"
import ContractsTable from "./Contracts/ContractsTable"
import OrdersTable from "./Orders/OrdersTable"
import { useTableCategoryEffect } from "hooks/useTableCategoryEffect"

const tablesHeight = {
  Employees: "70vh",
  Leads: "78vh",
  Orders: "84vh",
  Offers: "78vh",
  Contracts: "84vh",
}

const Tables: FC<TableItemProps> = ({ tables, currentTableName }) => {
  const dispatch = useDispatch<AppDispatch>()

  const leadDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.leadDisplayCategory
  )
  const offerDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.offerDisplayCategory
  )
  const contractDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.contractDisplayCategory
  )

  const leadCategoryActions: Record<LeadDisplayCategoriesType, () => void> = {
    Active: () => dispatch(getLeads()),
    Archived: () => dispatch(getLeads({ status: "Archived" })),
    Canceled: () => dispatch(getLeads({ status: "Canceled" })),
  }
  const offerCategoryActions: Record<OfferDisplayCategoriesType, () => void> = {
    All: () => dispatch(getOffers({ is_archived: false })),
    Archived: () => dispatch(getOffers({ is_archived: true })),
  }
  const contractCategoryActions: Record<ContractDisplayCategoriesType, () => void> =
    {
      Accepted: () => dispatch(getContracts()),
      Archived: () =>
        dispatch(getContracts({ status: "", is_archived: true })),
      Pending: () => dispatch(getContracts({ status: "PENDING" })),
    }

  useTableCategoryEffect<LeadDisplayCategoriesType>({
    category: leadDisplayCategory,
    categoryActions: leadCategoryActions,
  })

  useTableCategoryEffect<OfferDisplayCategoriesType>({
    category: offerDisplayCategory,
    categoryActions: offerCategoryActions,
  })

  useTableCategoryEffect<ContractDisplayCategoriesType>({
    category: contractDisplayCategory,
    categoryActions: contractCategoryActions,
  })

  const tableComponents: Record<TableNameType, any> = {
    Employees: <EmployeesTable table={tables.Employees} />,
    Leads: <LeadsTable table={tables.Leads} />,
    Orders: <OrdersTable />,
    Offers: <OffersTable table={tables.Offers} />,
    Contracts: <ContractsTable table={tables.Contracts} />,
  }

  const currentTableComponent = tableComponents[currentTableName]

  return (
    <div className={styles.tables}>
      <div
        className={styles.table}
        style={{ height: tablesHeight[currentTableName] }}
      >
        {currentTableComponent}
      </div>
    </div>
  )
}

export default Tables
