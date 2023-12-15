import { useActions } from "hooks/useActions"
import { FC } from "react"
import { useDispatch } from "react-redux"
import { editLead } from "reduxFolder/slices/Table.slice"
import { AppDispatch } from "types"
import { ILead } from "types/tables"
import styles from "./LeadOverview.module.scss"

type PropsType = {
  lead?: ILead
  setIsModalOpen: (value: boolean) => void
}

const LeadButtons: FC<PropsType> = ({ lead, setIsModalOpen }) => {
  const dispatch = useDispatch<AppDispatch>()

  const { filterLeads } = useActions()

  async function archiveLead() {
    if (!lead) return
    await dispatch(editLead({ id: +lead.id, data: { status: "Archived" } }))
    filterLeads(lead.id)
    setIsModalOpen(false)
  }
  async function cancelLead() {
    if (!lead) return
    await dispatch(editLead({ id: +lead.id, data: { status: "Canceled" } }))
    filterLeads(lead.id)
    setIsModalOpen(false)
  }
  async function restoreLead() {
    if (!lead) return
    await dispatch(editLead({ id: +lead.id, data: { status: "Active" } }))
    filterLeads(lead.id)
    setIsModalOpen(false)
  }

  const leadButtons = {
    Active: (
      <>
        <button type="button" className={styles.archieve} onClick={archiveLead}>
          Archiv
        </button>
        <button
          type="button"
          className={styles.disable}
          onClick={cancelLead}
          disabled={lead?.platform !== "365" && lead?.platform !== "Umzugspreis"}
        >
          Reklamiert
        </button>
      </>
    ),
    Arranged: <>-</>,
    Archived: (
      <button type="button" className={styles.restore} onClick={restoreLead}>
        Entpacken
      </button>
    ),
    Canceled: (
      <button type="button" className={styles.restore} onClick={restoreLead}>
        Erholen
      </button>
    ),
  }
  return (
    <div className={styles.buttons}>
      {lead ? leadButtons[lead?.status as keyof typeof leadButtons] : "-"}
    </div>
  )
}

export default LeadButtons
