import { FC } from "react"
import InputMUI from "components/InputMUI/InputMUI"
import { UseFormRegister } from "react-hook-form"
import {
  CalculatorFields,
  CalculatorFieldsKey,
  calculatorFieldsDict,
} from "./leadCalculatorHelpers"
import LeadCalculatorSelect from "./LeadCalculatorSelect"
import withEuroSymbol from "utils/withEuroSymbol"

type PropsType = {
  fieldName: CalculatorFieldsKey
  register: UseFormRegister<CalculatorFields>
  watchAllFields: CalculatorFields
  namesForOptions: CalculatorFieldsKey[]
  namesForDisabled?: CalculatorFieldsKey[]
  namesWithEuroSymbol?: CalculatorFieldsKey[]
  options: string[]
}

const LeadCalculatorField: FC<PropsType> = (props) => {
  const {
    fieldName,
    register,
    watchAllFields,
    options,
    namesForOptions,
    namesForDisabled,
    namesWithEuroSymbol,
  } = props

  let ReturningComponent = <></>

  if (namesForOptions.includes(fieldName)) {
    ReturningComponent = (
      <LeadCalculatorSelect fieldName={fieldName} register={register} options={options} />
    )
  } else {
    ReturningComponent = (
      <InputMUI
        type="number"
        register={register}
        watchFields={watchAllFields}
        name={fieldName}
        label={calculatorFieldsDict[fieldName]}
        disabled={namesForDisabled?.includes(fieldName)}
      />
    )
  }

  if (namesWithEuroSymbol?.includes(fieldName))
    ReturningComponent = withEuroSymbol(ReturningComponent)

  return ReturningComponent
}

export default LeadCalculatorField
