import ModalWindow from "components/ModalWindow/ModalWindow"
import { FC, useEffect, useState, MouseEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCompanies } from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import plusIcon from "assets/icons/plus.svg"
import styles from "./Companies.module.scss"
import companyStyles from "./Company/Company.module.scss"
import Company from "./Company/Company"
import AddCompany from "./AddCompany/AddCompany"
import Notification from "components/Notification/Notification"
import ExternalWorkers from "components/DispositionWorkers/ExternalWorkers"
import { useActions } from "hooks/useActions"
import moment from "moment"
import { ICompany } from "types/tables"

const Companies: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { setCurrentDate } = useActions()
  const companies = useSelector((state: RootStateType) => state.Table.companies)

  const [openedCompanyId, setOpenedCompanyId] = useState<number | null>(null)

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)

  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false)

  const [isAddNotifivationVisible, setIsAddNotifivationVisible] = useState(false)
  const [isEditNotifivationVisible, setIsEditNotifivationVisible] = useState(false)
	const [isDeleteNotifivationVisible, setIsDeleteNotifivationVisible] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCompany, setCurrentCompany] = useState<ICompany | undefined>(
    undefined
  )

  useEffect(() => {
    dispatch(getCompanies())
  }, [])

  if (!companies) return <div>Laden...</div>
  const Companies = companies.map((company) => (
    <Company
      key={company.id}
      company={company}
      handleCompanyClick={openCompanyWorkers}
      setIsEditModalOpen={setIsEditModalOpen}
      setCurrentCompany={setCurrentCompany}
			setIsDeleteNotifivationVisible={setIsDeleteNotifivationVisible}
    />
  ))

  function openCompanyWorkers(id: number | null, event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLDivElement
    if (
      !target.classList.contains(companyStyles.company) &&
      !target.classList.contains(companyStyles.name)
    )
      return

    setCurrentDate(moment().format("YYYY-MM-DD"))
    setOpenedCompanyId(id)
    setIsCompanyModalOpen(true)
  }

  return (
    <>
      <div className={styles.companies}>
        <div className={styles.header}>
          <div className={styles.title}>Unternehmen</div>
          <button
            className={styles.addButton}
            onClick={() => setIsAddCompanyModalOpen(true)}
          >
            <img src={plusIcon} alt="plus" />
          </button>
        </div>
        <div className={styles.table}>{Companies}</div>
      </div>

      <div className={styles.notification}>
        <Notification
          text="Unternehmen wurde hinzugefügt!"
          isVisible={isAddNotifivationVisible}
          setIsvisible={setIsAddNotifivationVisible}
        />
      </div>
      <div className={styles.notification}>
        <Notification
          text="Unternehmen wurde bearbeitet"
          isVisible={isEditNotifivationVisible}
          setIsvisible={setIsEditNotifivationVisible}
        />
      </div>
      <div className={styles.notification}>
        <Notification
          text="Unternehmen wurde gelöscht"
          isVisible={isDeleteNotifivationVisible}
          setIsvisible={setIsDeleteNotifivationVisible}
        />
      </div>

      <ModalWindow
        isModaltOpen={isCompanyModalOpen}
        setIsModaltOpen={setIsCompanyModalOpen}
        size="large"
        withLogo
      >
        <ExternalWorkers companyId={openedCompanyId!} />
      </ModalWindow>

      <ModalWindow
        isModaltOpen={isAddCompanyModalOpen}
        setIsModaltOpen={setIsAddCompanyModalOpen}
        size="small"
        withLogo
      >
        <AddCompany
          setIsAddCompanyModalOpen={setIsAddCompanyModalOpen}
          setIsNotifivationVisible={setIsAddNotifivationVisible}
        />
      </ModalWindow>
      <ModalWindow
        size="small"
        withLogo={true}
        isModaltOpen={isEditModalOpen}
        setIsModaltOpen={setIsEditModalOpen}
      >
        <AddCompany
          company={currentCompany}
          setIsAddCompanyModalOpen={setIsEditModalOpen}
          setIsNotifivationVisible={setIsEditNotifivationVisible}
        />
      </ModalWindow>
    </>
  )
}

export default Companies
