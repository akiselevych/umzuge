import { FC, ReactNode } from 'react'
import styles from './GeneralDataBlock.module.scss'


type Props = {
  cells: {
    title: string,
    value: string,
    imageBlock: ReactNode
  }[]
}


const GeneralDataBlock: FC<Props> = ({ cells }) => {
  return (
    <div className={styles.container}>
      {
        cells.map((cell, i) => (
          <div key={i} className={styles.cell}>
            {cell.imageBlock}
            <div className={styles.textBlock}>
              <p className={styles.title}>{cell.title}</p>
              <p className={styles.value}>{cell.value}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default GeneralDataBlock