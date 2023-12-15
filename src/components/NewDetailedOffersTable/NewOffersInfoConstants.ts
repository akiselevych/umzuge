import moment from "moment"
import { IAdditionalOfferInfo } from "types/offers"
import {NewDetailedOffersProps} from "types/index";

const years = []
for (let i = 2000; i <= +moment().format("YYYY"); i++) {
  years.push(i)
}
years.reverse()
export const yearsOptions = years.map((year) => ({ value: year, label: year }))

export const monthsOptions = [
  { value: 1, label: "Januar" },
  { value: 2, label: "Februar" },
  { value: 3, label: "März" },
  { value: 4, label: "April" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Dezember" },
]

type ContractsHeadersType = {
  [K in keyof Omit<IAdditionalOfferInfo, "id">]: string
}

export const headersNamesDict = {
  date: "Datum",
  name: "Name",
  net_sales: "Umsatz netto",
  percentShare: "% Anteil von Gesamtumsatz ings. 100%",
  administration: "Verwaltung",
  acquisition: "Akquise",
  carrier: "Träger",
  working_hours: "Arbeitszeit in Std/Träger",
  total_working_hours: "Arbeitszeit ingesamt",
  external: "Externe",
  work_hours_in_time: "Arbeitszeit in Std",
  total_working_hours_externally: "Arbeitszeit insgeamt extern",
  disposal_costs: "HV-Zone/Entsorgung Kosten",
  quantity_clothes_boxes: "Anzahl Kleiderkisten",
  quantity_moving_boxes: "Anzahl Umzugskartons",
  km: "Km",
  transportation_cost: "Transportkosten",
  total_cost: "Kosten Gesamt",
  profit_removals: "Gewinn Umzüge",
  profit_percent: "Gewinn in %",
  total_profit: "Gewinn Gesamt",
  second_profit_percent: "Gewinn in %",
  total_sales_directin: "Anteil Geschäftsfeld an Gesamtumsatz"
}
