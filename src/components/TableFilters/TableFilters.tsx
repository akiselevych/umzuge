// Libs
import { FC, useState } from "react"
// Styles
import styles from "components/TableFilters/TableFilters.module.scss"
import EmployeesTableFilters from "./EmployeesTableFilters"
import { TableItemProps } from "types/tables"
import ModalWindow from "components/ModalWindow/ModalWindow"
import Events from "components/Events/Events"

export const offerOptionsNames = [
  "ACCEPTED",
  "ARRANGED",
  "ASSIGNED",
  "STARTED",
  "FINISHED",
  "POSTPONED",
  "CANCELLED",
]

const TableFilters: FC<TableItemProps> = ({ currentTableName }) => {
  const [isEventsOpen, setIsEventsOpen] = useState(false)

  return (
    <>
      {currentTableName === "Employees" && (
        <div className={styles.filters}>
          <EmployeesTableFilters setIsEventsOpen={setIsEventsOpen} />
        </div>
      )}

      <ModalWindow
        isModaltOpen={isEventsOpen}
        setIsModaltOpen={setIsEventsOpen}
        size="large"
        withLogo
      >
        <Events />
      </ModalWindow>
    </>
  )
}

export default TableFilters
