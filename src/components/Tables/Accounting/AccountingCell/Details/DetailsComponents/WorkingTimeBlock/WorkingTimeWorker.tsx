import { FC } from "react"
import accountingCellStyles from "../../../AccountingCell.module.scss"
import styles from "../../CellDetailsContent.module.scss"
import classNames from "classnames"
import { removeSeconds } from "utils/extractTaskTimePart"

type PropsType = {
  name: string
  start_time: string
  end_time: string
}

const WorkingTimeWorker: FC<PropsType> = (props) => {
  const { name, start_time, end_time } = props

  return (
    <div className={classNames(accountingCellStyles.blocks, styles.worker)}>
      <div className={accountingCellStyles.block}>
        <div className={accountingCellStyles.name}>Vorname</div>
        <div className={accountingCellStyles.value}>{name}</div>
      </div>
      <div className={accountingCellStyles.block}>
        <div className={accountingCellStyles.name}>Arbeitsbeginn</div>
        <div className={accountingCellStyles.value}>{removeSeconds(start_time)}</div>
      </div>
      <div className={accountingCellStyles.block}>
        <div className={accountingCellStyles.name}>Arbeitsende</div>
        <div className={accountingCellStyles.value}>{removeSeconds(end_time)}</div>
      </div>
    </div>
  )
}

export default WorkingTimeWorker
