import classNames from "classnames"
import { FC } from "react"
import { useDrag } from "react-dnd"
import { ICar } from "types/tables"
import { DnDItemTypes } from "../OffersDayCalendar"
import styles from "./ItemsToSelect.module.scss"

const CarCell: FC<{ car: ICar | "external" }> = ({ car }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: DnDItemTypes.CAR,
    item: car,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      className={classNames(styles.car, car === "external" && styles.ghost)}
      ref={dragRef}
      style={{
        opacity: 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <div className={styles.propName}>Lkw-Nummer</div>
      <div className={styles.propValue}>
        {car !== "external"
          ? `${car.number} ${car.name} (${
              car.load_capacity && car.load_capacity
            } Tonne)`
          : "Externes Fahrzeug"}
      </div>
    </div>
  )
}

export default CarCell
