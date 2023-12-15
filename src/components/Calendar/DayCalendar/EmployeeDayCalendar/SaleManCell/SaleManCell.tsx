import { FC } from "react"
import styles from "./SaleManCell.module.scss"
import { serverDomain } from "services/API"
import photo from "assets/images/Ellipse.png"
import { IEmployee } from "types/tables"

type PropsType = {
  saleMan: IEmployee
  isVacation: boolean
  handleOpenVacationModal: (employeeId: string) => void
}

const SaleManCell: FC<PropsType> = ({
  saleMan,
  isVacation,
  handleOpenVacationModal,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.profile} onClick={() => handleOpenVacationModal(saleMan.id)}>
        <img
          src={saleMan.image_path ? `${serverDomain + saleMan.image_path}` : photo}
          alt="avatar"
        />
        <div className={styles.profile}>
          <div className={styles.mainInfo}>
            <div className={styles.name}>
              {`${saleMan.first_name} ${saleMan.last_name}`}
              <div
                className={`${styles.status} ${
                  isVacation ? styles.busy : styles.free
                }`}
              >
                {isVacation ? "Frei oder krank" : "Arbeitet"}
              </div>
            </div>
            <div className={styles.isAvailable}></div>
          </div>
          <div className={styles.role}>Verkäufer</div>
        </div>
      </div>
    </div>
  )
}

export default SaleManCell
