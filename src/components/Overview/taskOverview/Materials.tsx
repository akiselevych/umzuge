import { FC } from "react"
import plusIcon from "assets/icons/plus.circle.svg"
import minusIcon from "assets/icons/minus.circle.svg"
import arrowIcon from "assets/icons/arrow.svg"
import styles from "./TaskOverview.module.scss"
import { MaterialsType } from "types/offers"
import classNames from "classnames"
import { UseFormSetValue } from "react-hook-form"
import { ContractTasksFieldsType, TasksFieldsType } from "types/calendar"

type PropsType = {
  materials: MaterialsType
  setValueContract?: UseFormSetValue<ContractTasksFieldsType>
  setValueOffer?: UseFormSetValue<TasksFieldsType>
  isMaterialsOpen: boolean
  setIsMaterialsOpen: (value: boolean) => void
  isDisabled: boolean
}

const Materials: FC<PropsType> = ({
  materials,
  isMaterialsOpen,
  setIsMaterialsOpen,
  isDisabled,
  setValueOffer,
  setValueContract,
}) => {
  function handleChange(action: "plus" | "minus", material: keyof MaterialsType) {
    if (setValueOffer) {
      if (action === "plus") {
        setValueOffer(`materials.${material}`, materials[material] + 1)
      } else {
        setValueOffer(`materials.${material}`, materials[material] - 1)
      }
    } else {
			if (action === "plus") {
				setValueContract!(`materials.${material}`, materials[material] + 1)
			} else {
				setValueContract!(`materials.${material}`, materials[material] - 1)
			}
		}
  }

  const MaterialsItems = Object.keys(materials).map((m, i) => {
    const isValueZero = materials[m as keyof MaterialsType] === 0
    return (
      <div className={styles.material} key={i}>
        <span>{m.replace("_", "-")}</span>
        <div className={styles.materialsButtons}>
          <button
            type="button"
            onClick={() => handleChange("minus", m as keyof MaterialsType)}
            disabled={isValueZero || isDisabled}
          >
            <img src={minusIcon} />
          </button>
          <span>{materials[m as keyof MaterialsType]}</span>
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => handleChange("plus", m as keyof MaterialsType)}
          >
            <img src={plusIcon} />
          </button>
        </div>
      </div>
    )
  })

  return (
    <div
      className={styles.group}
      onClick={() => setIsMaterialsOpen(true)}
      id="materials"
    >
      <div className={styles.input}>
        <img src={arrowIcon} />
      </div>
      <span className={styles.span}>{"Materialien"}</span>
      <div
        className={classNames(
          styles.materialsPopUp,
          !isMaterialsOpen && styles.materialsHidden
        )}
      >
        {MaterialsItems}
      </div>
    </div>
  )
}

export default Materials
