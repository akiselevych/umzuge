import moment from "moment"
import { IAdditionalOfferInfo } from "types/offers"

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

export const headersNamesDict: ContractsHeadersType = {
  sale_man: "Verkäufer",
	offer_statistic__net_sales: "Nettoumsatz",
  offer_statistic__HV_zone_disposal_costs: "HV-Zonenentsorgungskosten",
  offer_statistic__Number_of_boxes: "Anzahl der Boxen",
  offer_statistic__Number_of_moving_boxes: "Anzahl der Umzugskartons",
  offer_statistic__km: "Kilometer",
  offer_statistic_id: "Angebotsstatistik ID",
  offer_statistic__acquisition_costs: "Akquisitionskosten",
	employee_turnover: "Mitarbeiterumsatz",
	employee_turnover_per_total: "Mitarbeiterumsatz pro Gesamt",
	acquisition: "Akquisition",
	management: "Management",
  couriers_count: "Kurieranzahl",
  count_couriers_hours: "Kurierstunden zählen",
  count_external_workers: "Externe Arbeitskräfte zählen",
  count_external_workers_hours: "Stunden für externe Arbeitskräfte zählen",
  transport_cost: "Transportkosten",
  total_costs: "Gesamtkosten",
  profit_removals: "Gewinn bei Entfernung",
  profit_removals_per_total: "Gewinn bei Entfernung pro Gesamt",
}
