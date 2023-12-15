import { FC, useState } from "react"
import styles from "./Offer.module.scss"
import xMarkIcon from "assets/icons/xmark.svg"
import { serverDomain } from "services/API"
import confirmedPhoto from "assets/images/emp_confirmed.svg"
import deniedPhoto from "assets/images/emp_denied .svg"
import waitingPhoto from "assets/images/emp_waiting.svg"
import { OfferFieldsCourierType } from "types/offers"
import { workerTypeDictionary } from "../ItemsToSelect/ExternalPopUp"
import ModalWindow from "components/ModalWindow/ModalWindow"
import CourierAvailablilityModal from "./CourierAvailablilityModal"

type PropsType = {
  courier: OfferFieldsCourierType | null
  handleClick?: () => void
  disabled?: boolean
  setUnavailableCouriers?: React.Dispatch<React.SetStateAction<number[]>>
}

const exrternalColors = {
  in_review: waitingPhoto,
  approved: confirmedPhoto,
  rejected: deniedPhoto,
}

const Courier: FC<PropsType> = ({
  courier,
  handleClick,
  disabled,
  setUnavailableCouriers,
}) => {
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)

  let displayImage
  if ((courier?.employee as any)?.image) {
    displayImage = (courier?.employee as any)?.image
  } else if (courier?.employee?.image_path) {
    displayImage = serverDomain + courier.employee.image_path
  } else {
    displayImage = waitingPhoto
  }

  if ((courier as any).status) {
    displayImage =
      exrternalColors[(courier as any).status as keyof typeof exrternalColors]
  }

  const displayName = courier?.employee
    ? `${courier?.employee?.first_name} ${courier?.employee?.last_name}`
    : courier?.first_name
    ? `${courier?.first_name} ${courier?.last_name}`
    : workerTypeDictionary[courier?.type as keyof typeof workerTypeDictionary]

  function openCourierAvailabilityModal() {
    if (courier?.employee) {
      setIsAvailabilityModalOpen(true)
    }
  }

  return (
    <>
      <div className={styles.courier} onClick={openCourierAvailabilityModal}>
        <div>
          {courier && <img src={displayImage} />}
          <div>{displayName}</div>
        </div>
        {!disabled && (
          <button type="button" onClick={handleClick}>
            <img src={xMarkIcon} alt="remove" />
          </button>
        )}
      </div>

      <ModalWindow
        size="tiny"
        withLogo={true}
        isModaltOpen={isAvailabilityModalOpen}
        setIsModaltOpen={setIsAvailabilityModalOpen}
      >
        <CourierAvailablilityModal
          courier={courier}
          setUnavailableCouriers={setUnavailableCouriers}
					setIsAvailabilityModalOpen={setIsAvailabilityModalOpen}
        />
      </ModalWindow>
    </>
  )
}

export default Courier
