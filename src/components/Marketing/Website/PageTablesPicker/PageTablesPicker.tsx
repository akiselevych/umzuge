//styles
import styles from "./index.module.scss"
//libs
import React from "react"
//types
import { webPagesRepeatedBlocksEnum, webPagesTableType } from "../types"
import classNames from "classnames"




const PageTablesPicker = ({ onTabClick, activeTab }: { onTabClick: (arg: webPagesTableType) => void, activeTab: webPagesTableType | webPagesRepeatedBlocksEnum }) => {

  return (
    <div className={styles.container}>
      {
        Object.entries(webPagesTableType).map((page, i) => (
          <React.Fragment key={i}>
            <div className={classNames(styles.tab, activeTab === page[1] ? styles.activeTab : '')} onClick={() => onTabClick(page[1])} >{page[1]}</div>
            {
              i !== Object.entries(webPagesTableType).length - 1 && <span className={styles.divider}></span>
            }
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default PageTablesPicker