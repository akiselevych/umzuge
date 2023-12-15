import { FC, useEffect, useState } from "react"
import styles from "components/Tables/Tables.module.scss"
import { IOffer } from "types/offers"
import Offer from "./Offer"
import { useActions } from "hooks/useActions"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import ModalWindow from "components/ModalWindow/ModalWindow"
import OfferOverview from "../../Overview/offerOverview/OfferOverview"
import { v1 } from "uuid"
import LoadMoreButton from "components/LoadMoreButton/LoadMoreButton"
import Notification from "components/Notification/Notification"

type PropsType = {
  table: IOffer[]
}

export const offersHeadersNames = {
  Angebotsnummer: "delivery_number",
  "Name des Kunden": "customer name",
  Verkäufer: "sale_man",
  Preis: "price",
  Adresse: "address",
  "Status der Lieferung": "delivery_status",
  Startdatum: "start_date",
  Enddatum: "end_date",
  Notizen: "notes",
}

const headers = {
  Angebotsnummer: "delivery_number",
  "Name des Kunden": "customer name",
  "E-Mail": "email",
  Telefon: "phone",
  Verkäufer: "sale_man",
  Notizen: "notes",
}

const OffersTable: FC<PropsType> = ({ table }) => {
  const isLoading = useSelector((state: RootStateType) => state.Table.isLoading)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentlyOpenedId, setCurrentlyOpenedId] = useState<number | null>(null)
  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  if (isLoading) return <div className={styles.stateMessage}>Laden...</div>
  if (!table || table.length === 0)
    return <div className={styles.stateMessage}>keine Angebote</div>

  const currentlyOpened = table.find((offer) => offer.id === currentlyOpenedId)

  const Headers = Object.keys(headers).map((h) => {
    return <th key={v1()}>{h}</th>
  })

  const Offers = table.map((offer) => (
    <Offer
      key={v1()}
      offer={offer}
      setCurrentlyOpenedId={setCurrentlyOpenedId}
      setIsModalOpen={setIsModalOpen}
    />
  ))

  return (
    <>
      <table className={styles.offers}>
        <thead>
          <tr>{Headers}</tr>
        </thead>
        <tbody>{Offers}</tbody>
      </table>
      <div className={styles.loadMore}>
        <LoadMoreButton item="offers" />
      </div>

      <div className={styles.notification}>
        <Notification
          isVisible={isEditNotificationVisible}
          setIsvisible={setIsEditNotificationVisible}
          text="Angebot wurde geändert"
        />
      </div>

      <ModalWindow
        size="small"
        withLogo={false}
        removeCloseButton
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
      >
        <OfferOverview
          offer={currentlyOpened as IOffer}
          setIsModalOpen={setIsModalOpen}
					setIsEditNotificationVisible={setIsEditNotificationVisible}
        />
      </ModalWindow>
    </>
  )
}

export default OffersTable
