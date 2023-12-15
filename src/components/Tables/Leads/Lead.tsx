import { FC } from "react"
import { ILead } from "types/tables"

const Lead: FC<{ lead: ILead; handleLeadOpen: (lead: ILead) => void }> = ({
  lead,
  handleLeadOpen,
}) => {
  return (
    <tr onClick={() => handleLeadOpen(lead)}>
      <td>{lead.kw || "-"}</td>
      <td>{lead.last_name || "-"}</td>
      <td>{lead.first_name || "-"}</td>
      <td>{lead.email || "-"}</td>
      <td>{lead.phone || "-"}</td>
    </tr>
  )
}

export default Lead
