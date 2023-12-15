export interface IUser {
  id: string
  date_of_birth: string
  first_name: string
  email: string
  is_active: boolean
  image_path: string
  last_name: string
  role: string
  phone: string
  const_salary: string
  bonus: { id: string; count: string }
  date_joined: string
}

interface IToUser extends IUser {
  courier_data: {
    disposition_id: number
    id: number
    salary: number
    user_id: number
  }
}

export interface IMessage {
  date_time: string
  from_user: IUser
  id: number
  message: string
  revised: boolean
  title: string
  to_user: IToUser
}

export type WorkflowNameType =
  | "Admin"
  | "SaleMan"
  | "Disposition"
  | "Marketing"
  | "Accounting"
