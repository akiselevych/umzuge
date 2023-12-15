import { FC } from "react"
import styles from "./CompaniesBlock.module.scss"
import Table from "./Table"
import companyIcon from "assets/icons/companyIcon.svg"
import detailsContentStyles from "../../Details/CellDetailsContent.module.scss"

export type CompanyPropsType = {
  company_name: string
  cars: { name: string; amount: number }[]
  workers: { name: string; amount: number }[]
}

const Company: FC<CompanyPropsType> = (props) => {
  const { company_name, cars, workers } = props

  return (
    <div className={styles.company}>
      <div className={styles.name}>
        <div className={styles.companyIcon}>
          <img src={companyIcon} alt="company" />
        </div>
        <h2 className={detailsContentStyles.subtitle}>{company_name}</h2>
      </div>
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <h2 className={detailsContentStyles.subtitle}>LKW informationen</h2>
          <Table items={cars} />
        </div>
        <div className={styles.infoItem}>
          <h2 className={detailsContentStyles.subtitle}>Arbeiterinformationen</h2>
          <Table items={workers} />
        </div>
      </div>
    </div>
  )
}

export default Company
