import classNames from "classnames"
import { FC, useState } from "react"
import styles from "./Offer.module.scss"
import arrowIcon from "assets/icons/arrow.svg"
import plusIcon from "assets/icons/plus.circle.svg"
import minusIcon from "assets/icons/minus.circle.svg"
import { UseFormSetValue } from "react-hook-form"
import { MaterialsType, OfferFieldsType } from "types/offers"

type PropsType = {
  isOpened: boolean
  disabled?: boolean
  handleOpen?: () => void
  materials: MaterialsType
  setValue?: UseFormSetValue<OfferFieldsType>
}

const Materials: FC<PropsType> = ({
  isOpened,
  disabled,
  handleOpen,
  materials,
  setValue,
}) => {
  function handleChange(action: "plus" | "minus", material: keyof MaterialsType) {
    if (action === "plus") {
      setValue && setValue(`materials.${material}`, materials[material] + 1)
    } else {
      setValue && setValue(`materials.${material}`, materials[material] - 1)
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
            onClick={
              !disabled
                ? () => handleChange("minus", m as keyof MaterialsType)
                : undefined
            }
            disabled={isValueZero || disabled}
          >
            <img src={minusIcon} />
          </button>
          <span>{materials[m as keyof MaterialsType]}</span>
          <button
            type="button"
            onClick={
              !disabled
                ? () => handleChange("plus", m as keyof MaterialsType)
                : undefined
            }
            disabled={disabled}
          >
            <img src={plusIcon} />
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className={classNames(styles.cell, styles.materials)} onClick={handleOpen}>
      <div>Materialien</div>

      <img src={arrowIcon} />

      {/* Pop up */}
      <div className={classNames(styles.materialsPopUp, !isOpened && styles.materialsHidden)}>
        {MaterialsItems}
      </div>
    </div>
  )
}

export default Materials
