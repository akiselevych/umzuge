import { FC } from "react"
import styles from "components/TablesInfo/TablesInfo.module.scss"

type PropsType = {
  name: string
  value: string
}

const MiniInfoCard: FC<PropsType> = ({ name, value }) => {
  return (
    <div className={styles.card} style={{ padding: '12px 16px' ,gap: 4 }}>
      <div className={styles.singleValue}>{value}</div>
      <div className={styles.name}>{name}</div>
    </div>
  )
}

export default MiniInfoCard
