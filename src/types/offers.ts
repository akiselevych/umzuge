import { ICar, ICourier } from "./tables"

export interface ICustomer {
  id: number | string
  first_name: string
  last_name: string
  email: string
}

export interface ISaleMan extends Omit<ICustomer, "email"> {
  image_path: string | null
}

export type AdditionalDocumentType = {
  id: number
  document: string
  name: string
  created_at: string
  offer: number | null
  contract: number | null
}

export type SentStatusType = "TO_SEND" | "FINAL_SEND" | "SENT" | "ARCHIVE"
export interface IOffer {
  courier_id: number
  customer: ICustomer & { phone: string; follow_up_date: string }
  start_date: string
  end_date: string
  delivery_number: string
  delivery_status:
    | "ACCEPTED"
    | "ARRANGED"
    | "ASSIGNED"
    | "STARTED"
    | "FINISHED"
    | "POSTPONED"
    | "CANCELLED"
  id: number
  notes: string
  price: string
  start_address: string
  end_address: string
  sale_man: ISaleMan | null
  pdf_file: string | null
  is_archived: boolean
  additional_documents: AdditionalDocumentType[]
  sent_status: SentStatusType
  sent_date?: string | null
  paid_date?: string | null
  paid_comment?: string
}

export interface OfferFieldsCourierType extends Partial<Omit<ICourier, "id">> {
  type?: string
  isExternal?: boolean
  company_id?: number
  id: number | string
  first_name?: string
  last_name?: string
}

export type IOfferExternalCar = {
  id: string
  type: string
  company: number
  is_external: boolean
}

export type OfferFieldsType = {
  couriers: OfferFieldsCourierType[]
  car: ICar[]
  external_cars?: IOfferExternalCar[]
  start_time: string
  start_time_hours1: string
  start_time_hours2: string
  start_time_minutes1: string
  start_time_minutes2: string
  end_time: string
  end_time_hours1: string
  end_time_hours2: string
  end_time_minutes1: string
  end_time_minutes2: string
  materials: MaterialsType
  notes: string
}
export type MaterialsType = {
  "Kleiderbox groß": number
  "Kleiderbox klein": number
  Halteverbotszone: number
  Bücherkarton: number
  Plastikbox: number
  Klebeband: number
  Kreppband: number
  "Vorsicht Glas Klebeband": number
  "Rolle Luftpolsterfolie": number
  Werkzeugkoffer: number
}

export interface IAdditionalOfferInfo {
  id: number
  sale_man: {
    id: 10
    first_name: string
    last_name: string
    image_path: string
  }
  offer_statistic__HV_zone_disposal_costs: number | null
  offer_statistic__Number_of_boxes: number | null
  offer_statistic__Number_of_moving_boxes: number | null
  offer_statistic__km: number | null
  offer_statistic_id: number
  offer_statistic__acquisition_costs: number | null
  couriers_count: number | null
  count_couriers_hours: number | null
  count_external_workers: number | null
  count_external_workers_hours: number | null
  transport_cost: number | null
  total_costs: number | null
  profit_removals: number | null
  profit_removals_per_total: number | null
  employee_turnover: number | null
  employee_turnover_per_total: number | null
  acquisition: number | null
  management: number | null
  offer_statistic__net_sales: number | null
}
