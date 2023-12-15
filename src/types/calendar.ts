import { IOffer, MaterialsType } from "types/offers"
import { ICar, IContract } from "./tables"

export type TaskExternalWorkerType = {
  id: number
  first_name: string
  last_name: string
  amount: string
  notes: string
  type: string
  company: number
  status: "approved" | "rejected" | "in_review"
	company_name: string
} | null

export interface ITaskCourier {
  id: number
  employee: {
    id: number
    first_name: string
    last_name: string
    email: string
    image: string
  }
}
export interface ITask {
  id: number
  courier: ITaskCourier
  contract: IContract | null
  delivery: IOffer | null
  car: ICar[]
  title: string
  description: string
  date: string
  start_time: string
  end_time: string
  is_active: boolean
  is_done: boolean
  external_workers: TaskExternalWorkerType
  materials: MaterialsType | null
}

export type TasksFieldsType = {
  start_address: string | undefined
  end_address: string | undefined
  price: string | undefined
  customer_name: string | undefined
  courier_id?: {
    value: string | number
    label: string
  }
  cars?: {
    value: string | number
    label: string
  }[]
  date: string | undefined
  delivery_number: string | undefined
  delivery_status: string | undefined
  notes: string | undefined
  start_time: string | undefined
  start_time_hours1: string | undefined
  start_time_hours2: string | undefined
  start_time_minutes1: string | undefined
  start_time_minutes2: string | undefined
  end_time: string | undefined
  end_time_hours1: string | undefined
  end_time_hours2: string | undefined
  end_time_minutes1: string | undefined
  end_time_minutes2: string | undefined
  materials: MaterialsType
  couriers?: {
    value: string | number
    label: string
  }[]
}

export type ContractTasksFieldsType = {
  contract?: IContract | null
  date: string | undefined
  courier_id?: {
    value: string | number
    label: string
  }
  cars?: {
    value: string | number
    label: string
  }[]
  notes: string | undefined
  start_time: string | undefined
  start_time_hours1: string | undefined
  start_time_hours2: string | undefined
  start_time_minutes1: string | undefined
  start_time_minutes2: string | undefined
  end_time: string | undefined
  end_time_hours1: string | undefined
  end_time_hours2: string | undefined
  end_time_minutes1: string | undefined
  end_time_minutes2: string | undefined
  materials: MaterialsType
}

export interface IAddTask extends Partial<Omit<ITask, "car">> {
  courier_id?: number | string
  contract_id?: number | string
  delivery_id?: number
  car: (number | string)[]
  external_workers_id?: number
}

export type ExternalWorkersType =
  | "specialist/carrier"
  | "assembler"
  | "truck driver 3,5t"
  | "truck driver from 7,5t"
  | "Other"

export interface IExternalWorker {
  id: number
  first_name?: string
  last_name?: string
  notes?: string
  amount?: string
  total_time?: number
  real_total_time?: number
  type: ExternalWorkersType
  company?: number
	company_name?: string
}

export interface IInternalSaleMan {
  id: number
  first_name: string
  last_name: string
  const_salary: number
  count_offers: number
  total_time: number
  image_path: string
  bonus: string
}

export interface IInternalCourier extends IInternalSaleMan {
  real_total_time: number
}

type VacationEmployeeType = {
  id: number
  first_name: string
  last_name: string
  image: string
  role: string
}

export interface IVacation {
  id: number
  type: "paid" | "unpaid" | "sick" | "other"
  start_date: string
  end_date: string
  notes: string
  approved: boolean | null
  employee: VacationEmployeeType
  approved_by: VacationEmployeeType
  created_at: string
}
export interface IEditVacation extends Omit<IVacation, "approved_by"> {
  approved_by_id: number | null
}
export interface IAddVacation
  extends Omit<IVacation, "approved_by" | "id" | "employee" | "created_at"> {
  employee_id: number
  approved_by_id: number | null
}

export interface IMeetingBook {
  id: number
  customers: {
    id: number
    name: string
    email: string
    phone: string
  }[]
  sale_man_id: number
  meeting_id: number
  join_web_url: string;
  space: number
  start_address: string
  floor_from: number
  end_address: string
  friendly_end_address: string;
  friendly_start_address: string;
  floor_to: number
  /** YYYY-MM-DD format */
  desired_date: string
  /** YYYY-MM-DD format */
  date: string
  /** HH:MM:SS format */
  time: string
  notes: string | null
  type: "online" | "offline"
}

export interface IMeeting {
  id: number
  /** YYYY-MM-DD format */
  date: string
  /** HH:MM:SS format */
  time: string
  available: boolean
  sale_man: number
  name: string
  type: "online" | "offline"
}

export interface IMeetingBookResponse {
  count: number
  next: string | null
  previous: string | null
  results: IMeetingBook[]
}

export interface IMeetingsResponse {
  count: number
  next: string | null
  previous: string | null
  results: IMeeting[]
}

export interface IMeetingAddBody {
  times: {
    start_time: string
    end_time: string
  }[]
  date: string
  sale_man_id: number
  type: string
  name: string
}

export interface IMeetingEditBody {
  new_name: string
  old_name: string
  new_type: string
  old_type: string
  times: {
    start_time: string
    end_time: string
  }[]
  date: string
  sale_man_id: number
}

export type IMeetingAddResponse = IMeetingAddBody

export type CalendarItemType = "Angebote" | "Mitarbeiter"
export type CalendarViewModeType = "Tag" | "Woche" | "Monat"
export type CurrentScreenType = "Calendar" | "Internal workers" | "Suppliers"
