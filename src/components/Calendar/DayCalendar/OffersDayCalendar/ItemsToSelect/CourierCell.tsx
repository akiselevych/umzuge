import { FC } from "react"
import { ICourier } from "types/tables"
import styles from "./ItemsToSelect.module.scss"
import defaultPhoto from "assets/images/person.svg"
import { serverDomain } from "services/API"
import { useDrag } from "react-dnd"
import { DnDItemTypes } from "../OffersDayCalendar"
import classNames from "classnames"

const CourierCell: FC<{ courier: ICourier | "external" }> = ({ courier }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: DnDItemTypes.COURIER,
    item: courier,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      className={classNames(styles.courier, courier === "external" && styles.ghost)}
      ref={dragRef}
      style={{
        opacity: 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <img
        src={
          courier !== "external" && courier.employee.image_path
            ? `${serverDomain + courier.employee.image_path}`
            : defaultPhoto
        }
        alt="avatar"
      />
      <div className={styles.profile}>
        <div className={styles.mainInfo}>
          <div className={styles.name}>
            {courier !== "external"
              ? `${courier.employee.first_name} ${courier.employee.last_name}`
              : "Externer Mitarbeiter"}
          </div>
        </div>
        <div className={styles.role}>Kurier</div>
      </div>
    </div>
  )
}

export default CourierCell
