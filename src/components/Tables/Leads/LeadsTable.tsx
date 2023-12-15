import { FC, useEffect, useState } from "react"
import styles from "components/Tables/Tables.module.scss"
import ModalWindow from "components/ModalWindow/ModalWindow"
import LeadOverview from "../../Overview/leadOverview/LeadOverview"
import Lead from "./Lead"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { ILead } from "types/tables"
import { v1 } from "uuid"
import LoadMoreButton from "components/LoadMoreButton/LoadMoreButton"
import Notification from "components/Notification/Notification"

type PropsType = {
  table: ILead[]
  isAdditional?: boolean
}

export const leadsHeadersNames = {
  "Anfrage-ID": "kw",
  Nachname: "last_name",
  Vorname: "first_name",
  "E-Mail": "email",
  Telefonnummer: "phone",
  Plattform: "platform",
  Wunschtermin: "preferred_appointment",
  "Lead erhalten": "lead_received_on",
  Erstkontaktversuch: "date_of_contact_attempt",

  Telefon: "by_phone",
  Messenger: "by_messanger",
  Email: "by_email",
  "Online-Besichtigung": "online_viewing",
  "Vor-Ort Besichtigung": "on_site_visit",
  "Telefonisch oder Schriftverkehr": "by_correspondence",

  "Follow Up Datum": "follow_up_date",
  Notizen: "notes",
}
const headers = {
  "Anfrage-ID": "kw",
  Nachname: "last_name",
  Vorname: "first_name",
  "E-Mail": "email",
  Telefon: "phone",
}

const LeadsTable: FC<PropsType> = ({ table, isAdditional }) => {
  const isLoading = useSelector((state: RootStateType) => state.Table.isLoading)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentlyOpened, setCurrentlyOpened] = useState<string | null>(null)
  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)

  useEffect(() => {
    if (isAdditional) {
      document.body.style.overflow = "hidden"
    }
  }, [isModalOpen])

  function handleLeadOpen(l: ILead) {
    setIsModalOpen(true)
    setCurrentlyOpened(l.id)
  }

  if (isLoading) return <div className={styles.stateMessage}>Laden...</div>
  if (!table || table.length === 0)
    return <div className={styles.stateMessage}>keine Leads</div>

  const currentOverview = table.find((t) => t.id === currentlyOpened)

  const Headers = Object.keys(headers).map((h) => <th key={v1()}>{h}</th>)

  const Leads = table.map((l, i) => (
    <Lead lead={l} key={i} handleLeadOpen={handleLeadOpen} />
  ))

  return (
    <>
      <table className={styles.leads}>
        <thead>
          <tr>{Headers}</tr>
        </thead>
        <tbody>{Leads}</tbody>
      </table>
      <div className={styles.loadMore}>
        <LoadMoreButton item="leads" />
      </div>

      <div className={styles.notification}>
        <Notification
          isVisible={isEditNotificationVisible}
          setIsvisible={setIsEditNotificationVisible}
          text="Lead wurde geändert"
        />
      </div>

      <ModalWindow
        size="medium"
        withLogo={false}
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
        removeCloseButton
      >
        <LeadOverview
          lead={currentOverview as ILead}
          setIsModalOpen={setIsModalOpen}
					setIsEditNotificationVisible={setIsEditNotificationVisible}
        />
      </ModalWindow>
    </>
  )
}

export default LeadsTable
