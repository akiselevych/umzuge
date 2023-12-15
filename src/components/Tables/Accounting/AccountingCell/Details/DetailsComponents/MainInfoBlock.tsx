import { FC } from "react"
import styles from "../../AccountingCell.module.scss"
import contractDetailsStyles from "../CellDetailsContent.module.scss"
import classNames from "classnames"
import moment from "moment"

export type ContractDetailsMainInfoPropsType = {
  customer_name: string
  date: string
  start_address: string
  end_address: string
  start_time?: string
}

const nameToGerman = {
  customer_name: "Kunde",
  date: "Datum",
  start_address: "Startadresse",
  end_address: "Endadresse",
  start_time: "Startzeit",
}

const MainInfoBlock: FC<ContractDetailsMainInfoPropsType> = (props) => {
  const BlockItems = (
    Object.keys(props) as (keyof ContractDetailsMainInfoPropsType)[]
  ).map((key, i) => {
    let value = props[key]
    if (!value) return
    if (key === "date") {
      value = moment(value).format("DD/MM/YYYY")
    }
    if (key === "start_time") {
      value = value.length > 5 ? value.slice(0, 5) : value
    }

    return (
      <div className={styles.block} key={i}>
        <div className={styles.name}>{nameToGerman[key]}:</div>
        <div
          className={styles.value}
          style={key.includes("address") ? { maxWidth: "96%" } : {}}
        >
          {value}
        </div>
      </div>
    )
  })

  return (
    <div className={styles.info}>
      <div
        className={classNames(styles.blocks, contractDetailsStyles.mainInfo)}
        style={props.start_time ? {} : { gridTemplateColumns: "2fr 1fr 3fr 3fr" }}
      >
        {BlockItems}
      </div>
    </div>
  )
}

export default MainInfoBlock
