import { FC } from "react"
import styles from "./AccountingCell.module.scss"

type PropsType = {
  firm_name?: string
  customer_name?: string
  price: number | string | null
  address: string
}

const CellsBlock: FC<PropsType> = ({ firm_name, customer_name, price, address }) => {
  return (
    <div className={styles.blocks}>
      {firm_name && (
        <div className={styles.block}>
          <div className={styles.name}>Name der Firma:</div>
          <div className={styles.value}>{firm_name}</div>
        </div>
      )}
      <div className={styles.block}>
        <div className={styles.name}>Name des Kunden:</div>
        <div className={styles.value}>{customer_name ?? "-"}</div>
      </div>
      {price && (
        <div className={styles.block}>
          <div className={styles.name}>Preis:</div>
          <div className={styles.value}>{price} €</div>
        </div>
      )}
      <div className={styles.block}>
        <div className={styles.name}>Adresse:</div>
        <div className={styles.value}>{address}</div>
      </div>
    </div>
  )
}

export default CellsBlock
