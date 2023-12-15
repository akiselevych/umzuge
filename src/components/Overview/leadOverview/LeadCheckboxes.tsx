import { leadsHeadersNames } from "components/Tables/Leads/LeadsTable"
import { FC } from "react"
import { UseFormRegister } from "react-hook-form"
import styles from "./LeadOverview.module.scss"
import { ILead } from "types/tables"

const contactCheckboxNames = ["Telefon", "Messenger", "Email"]
const infoCheckboxNames = [
  "Online-Besichtigung",
  "Vor-Ort Besichtigung",
  "Telefonisch oder Schriftverkehr",
]
type PropsType = {
  lead?: ILead
  register: UseFormRegister<any>
  watch: any
  errors: any
}

const LeadCheckboxes: FC<PropsType> = ({ lead, register, watch, errors }) => {
  const validateContactCheckboxes = () => {
    const by_phone = watch("by_phone")
    const by_messanger = watch("by_messanger")
    const by_email = watch("by_email")
    return by_phone || by_messanger || by_email
  }
  const validateInfoCheckboxes = () => {
    const onlineViewing = watch("online_viewing")
    const onSiteVisit = watch("on_site_visit")
    const byCorrespondence = watch("by_correspondence")
    return onlineViewing || onSiteVisit || byCorrespondence
  }

  const ContactCheckboxes = contactCheckboxNames.map((ch, i) => (
    <Checkbox
      key={i}
      lead={lead}
      register={register}
      checkboxName={ch}
      validation={validateContactCheckboxes}
    />
  ))
  const InfoCheckboxes = infoCheckboxNames.map((ch, i) => (
    <Checkbox
      key={i}
      lead={lead}
      register={register}
      checkboxName={ch}
      validation={validateInfoCheckboxes}
    />
  ))
  return (
    <div className={styles.checkboxes}>
      <div className={styles.column}>
        <h2>Kontaktversuch</h2>
        <div className={styles.checkboxInner}>{ContactCheckboxes}</div>
        {errors.by_phone && errors.by_messanger && errors.by_email && (
          <div className={styles.errorMessage}>
            Bitte wählen Sie mindestens eine Option aus
          </div>
        )}
      </div>
      <div className={styles.column}>
        <h2>Infos</h2>
        <div className={styles.checkboxInner}>{InfoCheckboxes}</div>
        {errors.online_viewing &&
          errors.on_site_visit &&
          errors.by_correspondence && (
            <div className={styles.errorMessage}>
              Bitte wählen Sie mindestens eine Option aus
            </div>
          )}
      </div>
    </div>
  )
}

export default LeadCheckboxes

type CheckboxPropsType = {
  lead?: ILead
  register: UseFormRegister<any>
  checkboxName: string
  validation?: any
}

const Checkbox: FC<CheckboxPropsType> = ({
  lead,
  checkboxName,
  register,
  validation,
}) => (
  <label className={styles.label}>
    <input
      type="checkbox"
      className={styles.checkbox}
      {...register(
        leadsHeadersNames[checkboxName as keyof typeof leadsHeadersNames],
        {
          validate: validation,
        }
      )}
      disabled={lead?.status === "Arranged"}
    />
    <span>{checkboxName}</span>
  </label>
)
