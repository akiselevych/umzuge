//styles
import styles from "./index.module.scss"
//libs
import React from "react"
//types
import classNames from "classnames"
import { ICustomerReview } from "types/marketing"


type Props = {
  data: ICustomerReview["page_name"][],
  activeTab: string,
  onTabClick: (arg: ICustomerReview["page_name"]) => void
}


const PagePicker = ({ data, activeTab, onTabClick }: Props) => {
  return (
    <div className={styles.container}>
      {
        data.map((page, i) => (
          <React.Fragment key={i}>
            <div className={classNames(styles.tab, activeTab === page ? styles.activeTab : '')} onClick={() => onTabClick(page)} >{page}</div>
            {
              i !== data.length - 1 && <span className={styles.divider}></span>
            }
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default PagePicker