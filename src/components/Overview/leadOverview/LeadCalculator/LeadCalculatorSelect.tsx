import { FC } from "react"
import {
  CalculatorFields,
  CalculatorFieldsKey,
  calculatorFieldsDict,
} from "./leadCalculatorHelpers"
import { UseFormRegister } from "react-hook-form"
import styles from "./LeadCalculator.module.scss"

type PropsType = {
  fieldName: CalculatorFieldsKey
  register: UseFormRegister<CalculatorFields>
  options: string[]
}

const LeadCalculatorSelect: FC<PropsType> = ({ fieldName, register, options }) => {
  const OptionsComponents = options.map((o, i) => (
    <option key={i} value={o}>
      {o}
    </option>
  ))

  return (
    <div className={styles.selectContainer}>
      <select className={styles.styledSelect} {...register(fieldName)}>
        {OptionsComponents}
      </select>
      <span className={styles.selectLabel}>{calculatorFieldsDict[fieldName]}</span>
    </div>
  )
}

export default LeadCalculatorSelect
