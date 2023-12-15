import { FC } from "react"
import styles from "./Offer.module.scss"
import { OfferFieldsCourierType } from "types/offers"

type PropsType = {
  courier: OfferFieldsCourierType | null
  setUnavailableCouriers?: React.Dispatch<React.SetStateAction<number[]>>
  setIsAvailabilityModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CourierAvailablilityModal: FC<PropsType> = ({
  courier,
  setUnavailableCouriers,
  setIsAvailabilityModalOpen,
}) => {
  function makeCourierAvailable() {
    setUnavailableCouriers &&
      setUnavailableCouriers((prev) => prev.filter((id) => id !== courier?.id))
    setIsAvailabilityModalOpen(false)
  }

  function closeModal() {
    setIsAvailabilityModalOpen(false)
  }

  return (
    <div className={styles.courierAvailablilityModal}>
      <h1 className="modalTitle">Sollte dieser Kurier für heute verfügbar sein?</h1>
      <div className={styles.buttons}>
        <button onClick={makeCourierAvailable}>Bestätigen</button>
        <button onClick={closeModal}>Ablehnen</button>
      </div>
    </div>
  )
}

export default CourierAvailablilityModal
