import { FC } from "react"
import { ICar } from "types/tables"
import styles from "./Offer.module.scss"
import xMarkIcon from "assets/icons/xmark.svg"

const Car: FC<{
  car: ICar | null
  handleClick?: () => void
  disabled?: boolean
}> = ({ car, handleClick, disabled }) => {
  return (
    <div className={styles.courier}>
      <div>
        {car
          ? car.is_external
            ? `${car.type}`
            : `${car.name} (${
                car.load_capacity && car.load_capacity
              } Tonne)`
          : "None"}
      </div>
      {!disabled && (
        <button type="button" onClick={handleClick}>
          <img src={xMarkIcon} alt="remove" />
        </button>
      )}
    </div>
  )
}

export default Car
