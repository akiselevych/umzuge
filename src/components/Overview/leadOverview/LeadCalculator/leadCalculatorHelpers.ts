export interface CalculatorFields {
  fixedCost: number
  numberOfInternalEmployees: number // 1-10
  workingHoursPerPersonInternal: number
  internalHourlyRate: number
  numberOfExternalEmployees: number // 1-10
  workingHoursPerPersonExternal: number
  externalHourlyRate: number
  numberOfVehicles: number // 1-10
  totalKilometersDriven: number
  kilometerRate: number
  numberOfPeopleNeedingAccommodation: number // 1-10
  accommodationCostPerPerson: number
  totalCosts: number | string
  surcharge: number // 1.2, 1.25, 1.3, 1.35
  netPrice: number | string
  grossPrice: number | string
}

export type CalculatorFieldsKey = keyof CalculatorFields

export const calculatorFieldsDict: Record<CalculatorFieldsKey, string> = {
  fixedCost: "Fixkosten",
  numberOfInternalEmployees: "Anzahl MA (intern)",
  workingHoursPerPersonInternal: "Arbeitsstunden pro Person (Intern)",
  internalHourlyRate: "Stundensatz intern",
  numberOfExternalEmployees: "Anzahl MA (extern)",
  workingHoursPerPersonExternal: "Arbeitsstunden pro Person (Extern)",
  externalHourlyRate: "Stundensatz extern",
  numberOfVehicles: "Anzahl Fahrzeuge",
  totalKilometersDriven: "Gefahrene KM insgesamt",
  kilometerRate: "Kilometersatz",
  numberOfPeopleNeedingAccommodation: "Anzahl an Personen die Unterkunft benötigen",
  accommodationCostPerPerson: "Unterkunftskosten pro Person",
  totalCosts: "Kosten ingesamt",
  surcharge: "Zuschlag (30%)",
  netPrice: "Nettopreis",
  grossPrice: "Bruttopreis",
}

export const calculatorStartData: CalculatorFields = {
  fixedCost: 350,
  numberOfInternalEmployees: 1, // 1-10
  workingHoursPerPersonInternal: 0,
  internalHourlyRate: 0,
  numberOfExternalEmployees: 1, // 1-10
  workingHoursPerPersonExternal: 0,
  externalHourlyRate: 0,
  numberOfVehicles: 1, // 1-10
  totalKilometersDriven: 0,
  kilometerRate: 0.5,
  numberOfPeopleNeedingAccommodation: 1, // 1-10
  accommodationCostPerPerson: 0,
  totalCosts: 0, // This would be calculated
  surcharge: 1.3, // 1.2, 1.25, 1.3, 1.35
  netPrice: 0, // This would be calculated
  grossPrice: 0, // This would be calculated
}

export const gridFieldsToMap: CalculatorFieldsKey[] = [
  "numberOfInternalEmployees",
  "workingHoursPerPersonInternal",
  "internalHourlyRate",
  "numberOfExternalEmployees",
  "workingHoursPerPersonExternal",
  "externalHourlyRate",
  "numberOfVehicles",
  "totalKilometersDriven",
  "kilometerRate",
]

export const buttonRowFieldsToMap: CalculatorFieldsKey[] = [
  "numberOfPeopleNeedingAccommodation",
  "accommodationCostPerPerson",
]

export const resultFieldsToMap: CalculatorFieldsKey[] = [
  "totalCosts",
  "surcharge",
  "netPrice",
  "grossPrice",
]

export const calculateResults = (data: CalculatorFields) => {
  // Perform calculations using the data from the form
  const fixedCosts = parseFloat(data.fixedCost.toString())
  const internalCosts =
    data.numberOfInternalEmployees * data.workingHoursPerPersonInternal * data.internalHourlyRate
  const externalCosts =
    data.numberOfExternalEmployees * data.workingHoursPerPersonExternal * data.externalHourlyRate
  const vehicleCosts = data.numberOfVehicles * data.totalKilometersDriven * data.kilometerRate
  const accommodationCosts =
    data.numberOfPeopleNeedingAccommodation * data.accommodationCostPerPerson

  // Summing up the total costs
  let totalCosts: string | number =
    fixedCosts + internalCosts + externalCosts + vehicleCosts + accommodationCosts

  // Applying the surcharge
  const surcharge = totalCosts * (data.surcharge - 1)
  let netPrice: string | number = totalCosts + surcharge

  // Since the tax rate is not provided, we'll assume gross price is equal to net price for this example
  const VAT_RATE = 0.19
  let grossPrice: string | number = netPrice * (1 + VAT_RATE)

  // Rounding the results to two decimal places
  totalCosts = (Math.round(totalCosts * 100) / 100).toFixed(2)
  netPrice = (Math.round(netPrice * 100) / 100).toFixed(2)
  grossPrice = (Math.round(grossPrice * 100) / 100).toFixed(2)

  return { totalCosts, netPrice, grossPrice }
}
