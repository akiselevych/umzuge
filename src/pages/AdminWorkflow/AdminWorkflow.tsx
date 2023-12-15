import { FC, useEffect, useState } from "react"
// Libs
import { useDispatch, useSelector } from "react-redux"
// Styles
import "styles/index.scss"
import styles from "pages/AdminWorkflow/AdminWorkflow.module.scss"
// Icons
import plusIcon from "assets/icons/plus.svg"
import downloadIcon from "assets/icons/download.svg"
// Types
import { AppDispatch, RootStateType } from "types"
// Components
import TableFilters from "components/TableFilters/TableFilters"
import Tables from "components/Tables/Tables"
import ModalWindow from "components/ModalWindow/ModalWindow"
import TablesList from "components/TablesList/TablesList"
import {
  getContracts,
  getEmployees,
  getLeads,
  getOffers,
} from "reduxFolder/slices/Table.slice"
import LeadOverview from "components/Overview/leadOverview/LeadOverview"
import EmployeeOverview from "components/Overview/employeeOverview/EmployeeOverview"
import OfferOverview from "components/Overview/offerOverview/OfferOverview"
import Notification from "components/Notification/Notification"
import ContractOverview from "components/Overview/contractOverview/ContractOverview"
import TablesCategoriesList from "components/TablesList/TablesCategoriesList"
import TablesInfo from "components/TablesInfo/TablesInfo"

const TableScreen: FC = () => {
  const user = useSelector((state: RootStateType) => state.User.user)
  const tables = useSelector((state: RootStateType) => state.Table.tables)
  const currentTableName = useSelector(
    (state: RootStateType) => state.Table.currentTableName
  )

  const dispatch = useDispatch<AppDispatch>()
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false)

  useEffect(() => {
    switch (currentTableName) {
      case "Employees": {
        dispatch(getEmployees())
        break
      }
      case "Leads": {
        dispatch(getLeads())
        break
      }
      case "Offers": {
        dispatch(getOffers())
        break
      }
      case "Contracts": {
        dispatch(getContracts({ status: "PENDING" }))
        break
      }

      default:
        break
    }
  }, [currentTableName])

  let AddNewItem = null
  let notificationText = ""
  let modalWindowSize: "small" | "large" | "medium" | "tiny" = "small"
  switch (currentTableName) {
    case "Employees": {
      AddNewItem = (
        <EmployeeOverview
          isAdding
          setIsModalOpen={setIsAddItemModalOpen}
          setIsAddingNotifivationVisible={setIsNotifivationVisible}
        />
      )
      notificationText = "Mitarbeiter wurde hinzugefügt"
      break
    }
    case "Leads": {
      AddNewItem = (
        <LeadOverview
          setIsModalOpen={setIsAddItemModalOpen}
          setIsAddingNotifivationVisible={setIsNotifivationVisible}
          isAdding
        />
      )
      modalWindowSize = "medium"
      notificationText = "Lead wurde hinzugefügt!"
      break
    }
    case "Offers": {
      AddNewItem = (
        <OfferOverview
          setIsModalOpen={setIsAddItemModalOpen}
          setIsAddingNotifivationVisible={setIsNotifivationVisible}
          isAdding
        />
      )
      notificationText = "Angebot wurde hinzugefügt!"
      break
    }
    case "Contracts": {
      AddNewItem = (
        <ContractOverview
          setIsModalOpen={setIsAddItemModalOpen}
          setIsAddingNotifivationVisible={setIsNotifivationVisible}
        />
      )
      notificationText = "Verträge wurde hinzugefügt!"
      break
    }

    default:
      break
  }

  return (
    <section className={styles.tableScreen}>
      {user && currentTableName !== "Employees" ? (
        <TablesInfo />
      ) : (
        <TableFilters tables={tables} currentTableName={currentTableName} />
      )}

      <div className={styles.tablesSection}>
        <Tables tables={tables} currentTableName={currentTableName} />
        <div className={styles.tablesOptions}>
          <TablesList tables={tables} currentTableName={currentTableName} />
          <TablesCategoriesList />
        </div>

        {currentTableName !== "Orders" && (
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className={styles.addButton}
          >
            <img src={plusIcon} alt="plus" />
          </button>
        )}

        <div className={styles.notification}>
          <Notification
            text={notificationText}
            isVisible={isNotifivationVisible}
            setIsvisible={setIsNotifivationVisible}
          />
        </div>
      </div>

      <ModalWindow
        size={modalWindowSize}
        withLogo={true}
        isModaltOpen={isAddItemModalOpen}
        setIsModaltOpen={setIsAddItemModalOpen}
      >
        {AddNewItem}
      </ModalWindow>
    </section>
  )
}

export default TableScreen
