import { FC, useState } from "react"
import { IEmployee } from "types/tables"
import ModalWindow from "components/ModalWindow/ModalWindow"
import EmployeeCell from "./EmployeeCell"
import EmployeeOverview from "../../Overview/employeeOverview/EmployeeOverview"
import styles from "../Tables.module.scss"
import Notification from "components/Notification/Notification"
import { useSelector } from "react-redux"
import { RootStateType } from "types"

const EmployeesTable: FC<{ table: IEmployee[] }> = ({ table }) => {
  const isLoading = useSelector((state: RootStateType) => state.Table.isLoading)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentlyOpenedId, setCurrentlyOpenedId] = useState<string | null>(null)
  const [isNotifivationVisible, setIsNotifivationVisible] = useState(false)

  const currentlyOpened = table.find((em) => em.id === currentlyOpenedId)

  if (isLoading) return <div className={styles.stateMessage}>Laden...</div>
  if (!table || table.length === 0)
    return <div className={styles.stateMessage}>keine Mitarbeiter</div>

  const Employees = table.map((e) => (
    <EmployeeCell
      key={e.id}
      emp={e}
      setIsModalOpen={setIsModalOpen}
      setCurrentlyOpenedId={setCurrentlyOpenedId}
      isMapping={true}
      setIsNotifivationVisible={setIsNotifivationVisible}
    />
  ))

  return (
    <>
      <div>{Employees}</div>
      <div className={styles.notification}>
        <Notification
          text="Die Nachricht wurde gesendet!"
          isVisible={isNotifivationVisible}
          setIsvisible={setIsNotifivationVisible}
        />
      </div>
      <ModalWindow
        size="small"
        withLogo={true}
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
      >
        <EmployeeOverview
          emp={currentlyOpened as IEmployee}
          setCurrentlyOpenedId={setCurrentlyOpenedId}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalWindow>
    </>
  )
}

export default EmployeesTable
