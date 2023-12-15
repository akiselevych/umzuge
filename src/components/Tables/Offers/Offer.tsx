import { FC } from "react"
import { IOffer } from "types/offers"
import styles from "components/Tables/Tables.module.scss"
import { serverDomain } from "services/API"
import photo from "assets/images/Ellipse.png"
import { extractDate } from "utils/extractTaskTimePart"

const Offer: FC<{
  offer: IOffer
  setCurrentlyOpenedId: (newValue: number | null) => void
  setIsModalOpen: (newValue: boolean) => void
}> = ({ offer, setCurrentlyOpenedId, setIsModalOpen }) => {
  function handleOpen() {
    setCurrentlyOpenedId(offer.id)
    setIsModalOpen(true)
  }

  return (
    <tr onClick={handleOpen}>
      <td>{offer.delivery_number}</td>
      <td>{offer.customer.first_name + " " + offer.customer.last_name}</td>
      <td>{offer.customer.email || '-'}</td>
      <td>{offer.customer.phone || '-'}</td>
      <td>
        <div className={styles.saleManColumn}>
          {offer.sale_man ? (
            <>
              <img
                src={
                  offer.sale_man?.image_path
                    ? serverDomain + offer.sale_man?.image_path
                    : photo
                }
              />
              {`${offer.sale_man?.first_name} ${offer.sale_man?.last_name}`}
            </>
          ) : (
            <div className={styles.empty}></div>
          )}
        </div>
      </td>
      <td>{offer.notes || "-"}</td>
    </tr>
  )
}

export default Offer
