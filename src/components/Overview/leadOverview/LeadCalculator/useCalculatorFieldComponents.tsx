import {
  CalculatorFields,
  buttonRowFieldsToMap,
  gridFieldsToMap,
  resultFieldsToMap,
} from "./leadCalculatorHelpers"
import LeadCalculatorField from "./LeadCalculatorField"
import { UseFormRegister } from "react-hook-form"

type PropsType = {
  register: UseFormRegister<CalculatorFields>
  watchAllFields: CalculatorFields
}

const useCalculatorFieldComponents = ({ register, watchAllFields }: PropsType) => {
  const MappedGridFields = gridFieldsToMap.map((f, i) => (
    <LeadCalculatorField
      key={i}
      fieldName={f}
      register={register}
      watchAllFields={watchAllFields}
      namesForOptions={[
        "numberOfInternalEmployees",
        "numberOfExternalEmployees",
        "numberOfVehicles",
      ]}
      namesWithEuroSymbol={["kilometerRate"]}
      options={Array.from(Array(10).keys()).map((i) => (i + 1).toString())}
    />
  ))

  const MappedButtonRowFields = buttonRowFieldsToMap.map((f, i) => (
    <LeadCalculatorField
      key={i}
      fieldName={f}
      register={register}
      watchAllFields={watchAllFields}
      namesForOptions={["numberOfPeopleNeedingAccommodation"]}
      options={Array.from(Array(10).keys()).map((i) => (i + 1).toString())}
    />
  ))

  const MappedResultFields = resultFieldsToMap.map((f, i) => (
    <LeadCalculatorField
      key={i}
      fieldName={f}
      register={register}
      watchAllFields={watchAllFields}
      namesForOptions={["surcharge"]}
      namesForDisabled={["totalCosts", "netPrice", "grossPrice"]}
      namesWithEuroSymbol={["totalCosts", "netPrice", "grossPrice"]}
      options={["1.20", "1.25", "1.3", "1.35"]}
    />
  ))

  return { MappedGridFields, MappedButtonRowFields, MappedResultFields }
}

export default useCalculatorFieldComponents
