import { IOffer, SentStatusType } from "types/offers"
import { instance } from "./API"
import { AxiosResponse } from "axios"
import { IContract } from "types/tables"

export type responseDataType<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const ACCOUNTING_API = {
  // Offers
  async getSearchedOffers(
    delivery_number: string,
    sent_status: SentStatusType,
    date_after: string,
    date_before: string
  ) {
    const response: AxiosResponse<responseDataType<IOffer>> = await instance.get(
      `api/v1/offers/search/?delivery_numbers_search=${delivery_number}&sent_status=${sent_status}&delivery_date_after=${date_after}&delivery_date_before=${date_before}`
    )
    return response.data
  },

  // Contracts
  async getSearchContracts(
    id: string,
    sent_status: SentStatusType,
    date_after: string,
    date_before: string
  ) {
    const response: AxiosResponse<responseDataType<IContract>> = await instance.get(
      `api/v1/contracts/search/?ids=${id}&sent_status=${sent_status}&date_after=${date_after}&date_before=${date_before}`
    )
    return response.data
  },

  // Tasks
  async getTasksByItemId(item_type: "offer" | "contract", item_id: number) {
    const param = item_type === "offer" ? "delivery_id" : "contract_id"

    const response = await instance.get(`api/v1/tasks/?${param}=${item_id}`)
    return response.data
  },
}
