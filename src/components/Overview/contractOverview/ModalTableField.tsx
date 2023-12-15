import ModalWindow from "components/ModalWindow/ModalWindow"
import { FC, useState } from "react"
import styles from "./ContractOverview.module.scss"

type PropsType = {
  isInfoModalOpen: boolean
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  children: React.ReactNode
}

const ModalTableField: FC<PropsType> = (props) => {
  const { isInfoModalOpen, setIsInfoModalOpen, children, name } = props

  return (
    <>
      <div className={styles.field}>
        <button type="button" onClick={() => setIsInfoModalOpen(true)}>
          {name}
        </button>
      </div>
      <ModalWindow
        isModaltOpen={isInfoModalOpen}
        setIsModaltOpen={setIsInfoModalOpen}
        size="medium"
        withLogo
      >
        {children}
      </ModalWindow>
    </>
  )
}

export default ModalTableField
