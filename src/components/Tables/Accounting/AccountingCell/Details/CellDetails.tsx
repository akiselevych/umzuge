import classNames from "classnames"
import { FC, useEffect, useRef, useState } from "react"
import styles from "./CellDetails.module.scss"
import chevronIcon from "assets/icons/arrow.svg"
import CellDetailsContent from "./CellDetailsContent"
import { ContractDetailsPropsType, OfferDetailsPropsType } from "../AccountingCell"

type PropsType = {
  item_type: "offer" | "contract"
  isDetailsOpen: boolean
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>
  offerDetailsProps: OfferDetailsPropsType
  contractDetailsProps: ContractDetailsPropsType
  number: string | number
}

const CellDetails: FC<PropsType> = ({
  item_type,
  isDetailsOpen,
  setIsDetailsOpen,
  offerDetailsProps,
  contractDetailsProps,
  number,
}) => {
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isDetailsOpen) {
      if (contentRef.current) {
        const contentElement = contentRef.current
        const calculatedHeight = contentElement.scrollHeight
        setContentHeight(calculatedHeight)
      }
    } else {
      setContentHeight(0)
    }
  }, [isDetailsOpen])

  useEffect(() => {
    if (!isDetailsOpen) return
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContentHeight(entry.contentRect.height)
        }
      }
    })

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [isDetailsOpen])

  return (
    <div
      className={classNames(styles.details, !isDetailsOpen && styles.hidden)}
      style={{
        height: contentHeight !== undefined ? contentHeight : 0,
        padding: isDetailsOpen ? "40px 32px" : "0 32px",
      }}
    >
      <div className={styles.content} ref={contentRef}>
        <div className={styles.header}>
          <div className={styles.number}>Angebotsnummer {number}</div>
        </div>

        <CellDetailsContent
          item_type={item_type}
          contractProps={item_type === "contract" ? contractDetailsProps : null}
          offerProps={item_type === "offer" ? offerDetailsProps : null}
          isDetailsOpen={isDetailsOpen}
        />
      </div>
      <button className={styles.closeButton} onClick={() => setIsDetailsOpen(false)}>
        <img src={chevronIcon} alt="close" />
      </button>
    </div>
  )
}

export default CellDetails
