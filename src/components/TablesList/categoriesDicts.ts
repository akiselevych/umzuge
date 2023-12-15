import {
  ContractDisplayCategoriesType,
  LeadDisplayCategoriesType,
  OfferDisplayCategoriesType,
} from "types/tables"

export const leadTableCategoriesDict: Record<LeadDisplayCategoriesType, string> = {
  Active: "Aktiv",
  Archived: "Archiviert",
  Canceled: "Reklamiert",
}

export const offerTableCategoriesDict: Record<OfferDisplayCategoriesType, string> = {
  All: "Alle",
  Archived: "Archiviert",
}

export const contractTableAdminCategoriesDict: Record<
  ContractDisplayCategoriesType,
  string
> = {
  Pending: "Schwebend",
  Accepted: "Akzeptiert",
  Archived: "Archiviert",
}

export const contractTableSaleManCategoriesDict: Record<
  ContractDisplayCategoriesType,
  string
> = {
  Pending: "Schwebend",
  Accepted: "Akzeptiert",
} as Record<ContractDisplayCategoriesType, string>
