import { FC, useEffect, useRef, useState } from "react"
import styles from "components/TablesInfo/TablesInfo.module.scss"
import verticalDots from "assets/icons/DotsThreeVertical.svg"
import tableStyles from "components/Tables/Tables.module.scss"
import classNames from "classnames"
import InfoCardValue from "./InfoCardValue"
import { TableInfoValueType } from "types/tables"

type PropsType = {
  name: string
  values: TableInfoValueType[] | undefined
  handleDownload?: () => void
  isLoading: boolean
}

const InfoCard: FC<PropsType> = ({ name, values, isLoading }) => {

  const Values = values?.map((item, i) => (
    <InfoCardValue key={i} item={item} values={values} />
  ))

  const renderDisplayValue = () => {
    if (isLoading) {
      return <div className={tableStyles.stateMessage}>Laden...</div>
    } else if (!Values) {
      return <div className={tableStyles.stateMessage}>Keine Daten</div>
    } else {
      return <div className={styles.content}>{Values}</div>
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.flex}>
        <h2 className={styles.title}>{name}</h2>
      </div>
      {renderDisplayValue()}
    </div>
  )
}

export default InfoCard
