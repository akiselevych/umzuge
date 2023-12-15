import { de } from "date-fns/locale"
import {
  IAddCar,
  IBonus,
  ICompany,
  IEditContract,
  IEvent,
  ILead,
  TableStatisticGoalsResponseType,
  TableStatisticsResponseType,
} from "types/tables"
import { IEmployee } from "types/tables"
import axios, { AxiosResponse } from "axios"
import {
  IAddTask,
  IAddVacation,
  IEditVacation,
  IExternalWorker,
  IMeetingAddBody,
  IMeetingAddResponse,
  IMeetingEditBody,
} from "types/calendar"
import { IPost, IBlock } from "types/marketing"
import { FetchBlock, FetchPost } from "reduxFolder/slices/marketingBlogSlice"

export const serverDomain = "https://api.sieben-umzuege.de/"

export const instance = axios.create({
  baseURL: serverDomain,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("access")}`
  return config
})

instance.interceptors.response.use(
  (response) => response, // If the request succeeds, we don't have to do anything and just return the config
  async (error) => {
    // Handle token refresh logic here
    if (error.response.status === 401) {
      const originalRequest = error.config

      if (!originalRequest._retry) {
        originalRequest._retry = true

        if (!localStorage.getItem("refresh")) {
          localStorage.clear()
          alert("Wrong username or password")
          return
        }

        try {
          const response = await axios.post(
            serverDomain + "/auth/jwt/refresh/",
            { refresh: localStorage.getItem("refresh") },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )

          if (response.status === 200) {
            localStorage.setItem("access", response.data.access)
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`
            return axios(originalRequest)
          }
        } catch (refreshError) {
          localStorage.clear()
          alert("Session time has expired, please log in again")
          window.location.href = "/login"
          console.log("window.location:", window.location)
          return Promise.reject(refreshError)
        }
      } else {
        localStorage.clear()
      }
    }

    return Promise.reject(error)
  }
)

export const API = {
  async login(userData: { username: string; password: string }) {
    const response = await instance.post("auth/jwt/create/", userData)
    return response.data
  },
  async getSingleUser(userId: string) {
    const response = await instance.get(`api/v1/employees/${userId}/`)
    return response.data
  },

  // Leads
  async getLeads(filters?: string | undefined, page = 1) {
    const response = await instance.get(
      `api/v1/customers/?status=Active&${filters || ""}&page=${page || ""}`
    )
    return response.data
  },
  async getSearchLeads(search: string) {
    const response = await instance.get(`api/v1/customers/?search=${search}`)
    return response.data
  },
  async editLead(id: number, data: Partial<ILead>) {
    const response = await instance.patch(`/api/v1/customers/${id}/`, data)
    return response.data
  },
  async addNewLead(leadData: any) {
    const response = await instance.post("api/v1/customers/", leadData)
    return response
  },
  async getLeadById(id: string) {
    const response = await instance.get(`api/v1/customers/${id}/`)
    return response.data
  },

  async getTableStatistics(user_id: string) {
    const response: TableStatisticsResponseType = await instance.get(
      `api/v1/leads-and-angebote/statistics/?employee_id=${user_id}`
    )
    return response.data
  },

  // Employees
  async getEmployees(role?: string) {
    const response = await instance.get(
      role ? `api/v1/employees/?role=${role}` : "api/v1/employees/"
    )
    return response.data
  },
  async getEmployeeById(id: string) {
    const response = await instance.get(`api/v1/employees/${id}/`)
    return response.data
  },
  async editEmployee(id: number, data: Partial<IEmployee>) {
    const response = await instance.patch(`api/v1/employees/${id}/`, data)
    return response.data
  },
  async addNewEmployee(employeeData: any) {
    const response = await instance.post("api/v1/employees/", employeeData)
    return response
  },
  async addEmloyeePhoto(id: number, image: any) {
    const response = await instance.post(`api/v1/image-load-for-employee/?user_id=${id}`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": "UgJjmY3zUjPhvFNpOaaRR2kdPQY3AKnTuVQkqARAbCce3tfSeuPEMxxPT7yk8m5S",
      },
    })
    return response
  },
  async getEmployeesStatistics(
    role: "courier" | "sale_man" | "external_worker",
    start_date: string,
    end_date: string,
    company_id?: number
  ) {
    const response = await instance.get(
      `api/v1/employees/statistics/?employee_type=${role}&start_date=${start_date}&end_date=${end_date}&company_id=${
        company_id || ""
      }`
    )
    return response.data
  },
  async changeEmployeePassword(id: number, data: { old_password: string; new_password: string }) {
    const response = await instance.post(`api/v1/employees/change-password/${id}/`, data)
    return response.data
  },

  //Companies
  async getCompanies() {
    const response = await instance.get("api/v1/companies/")
    return response.data
  },
  async addCompany(data: Partial<ICompany>) {
    const workers_info = [
      {
        id: 1,
        name: "Fachkraft/Träger",
        goingFee: "0 €",
        comingFee: "0 €",
        hourlyWage: "0 €",
      },
      {
        id: 2,
        name: "Monteur",
        goingFee: "0 €",
        comingFee: "0 €",
        hourlyWage: "0 €",
      },
      {
        id: 3,
        name: "LKW Fahrer 3,5t",
        goingFee: "0 €",
        comingFee: "0 €",
        hourlyWage: "0 €",
      },
      {
        id: 4,
        name: "LKW Fahrer ab 7,5t",
        goingFee: "0 €",
        comingFee: "0 €",
        hourlyWage: "0 €",
      },
      {
        id: 5,
        name: "Sonstigest",
        goingFee: "0 €",
        comingFee: "0 €",
        hourlyWage: "0 €",
      },
    ]
    const cars_info = [
      { id: 1, name: "LKW 3,5t", wage: "0 €" },
      { id: 2, name: "LKW 7,5t", wage: "0 €" },
      { id: 3, name: "LKW 12t", wage: "0 €" },
      { id: 4, name: "LKW 18t", wage: "0 €" },
      { id: 5, name: "LKW 40t SattelzugІ ", wage: "0 €" },
    ]

    const finalData = {
      ...data,
      workers_info: workers_info,
      cars_info: cars_info,
    }
    const response = await instance.post("api/v1/companies/", finalData)
    return response.data
  },
  async deleteCompany(id: number) {
    const response = await instance.delete(`api/v1/companies/${id}`)
    return response
  },

  // Contracts
  async getContracts(filters?: string, page = 1) {
    const defaultStatuses = ["ARRANGED", "ASSIGNED", "STARTED", "ACCEPTED", "FINISHED"].join(",")
    const response = await instance.get(
      `api/v1/contracts/?status=${defaultStatuses}&is_archived=false&${filters || ""}&page=${
        page || ""
      }`
    )
    return response.data
  },
  async getContractById(id: number) {
    const response = await instance.get(`api/v1/contracts/${id}/`)
    return response.data
  },
  async editContract(id: number, data: Partial<IEditContract>) {
    const response = await instance.patch(`api/v1/contracts/${id}/`, data)
    return response.data
  },
  async addContract(data: IEditContract) {
    const response = await instance.post("api/v1/contracts/", data)
    return response.data
  },

  // Vacations
  async getVacations(filters?: string) {
    const response = await instance.get(`api/v1/vacations/?${filters || ""}`)
    return response.data
  },
  async editVacation(id: number, data: Partial<IEditVacation>) {
    const response = await instance.patch(`api/v1/vacations/${id}/`, data)
    return response.data
  },
  async addVacation(data: IAddVacation) {
    const response = await instance.post("api/v1/vacations/", data)
    return response
  },

  // External workers
  async getExternalWorkers(companyId?: number) {
    const response = await instance.get(`api/v1/external-workers/?company_id=${companyId}`)
    return response.data
  },
  async editExternalWorker(data: Partial<IExternalWorker>) {
    const response = await instance.patch(`api/v1/external-workers/${data.id}/`, data)
    return response.data
  },
  async addExternalWorker(data: Omit<IExternalWorker, "id">) {
    const response = await instance.post("api/v1/external-workers/", data)
    return response.data
  },

  // Bonuses
  async getBonuses(employee_id: string, dateAfter?: string, dateBefore?: string) {
    const response = await instance.get(
      `api/v1/bonuses/?employee_id=${employee_id}&date_after=${dateAfter}&date_before=${dateBefore}`
    )
    return response.data
  },
  async addBonus(data: { employee_id: number; bonuses: number; date: string }) {
    const response = await instance.post(`api/v1/bonuses/`, data)
    return response.data
  },
  async editBonus(data: IBonus) {
    const response = await instance.post(`api/v1/bonuses/`, data)
    return response.data
  },

  // Offers
  async getOffers(filters?: string, page = 1) {
    const response = await instance.get(
      `api/v1/offers/?delivery_status=ARRANGED%2CASSIGNED%2CSTARTED%2CFINISHED%2CPOSTPONED%2CCANCELLED&is_archived=false&${
        filters || ""
      }&page=${page || ""}`
    )
    return response.data
  },
  async getSearchOffers(search: string, isOrders?: boolean) {
    const response = await instance.get(
      isOrders
        ? `api/v1/offers/?delivery_status=ACCEPTED&search=${search}`
        : `api/v1/offers/?delivery_status=ARRANGED%2CASSIGNED%2CSTARTED%2CFINISHED%2CPOSTPONED%2CCANCELLED&search=${search}`
    )
    return response.data
  },
  async getAccountingSearchOffers(search: string, filters: string) {
    const response = await instance.get(`api/v1/offers/?&search=${search}&${filters}`)
    return response.data
  },
  async getOfferById(id: number) {
    const response = await instance.get(`api/v1/offers/${id}/`)
    return response.data
  },
  async editOffer(id: number, data: any) {
    const response = await instance.patch(`api/v1/offers/${id}/`, data)
    return response.data
  },
  async addOffer(data: any) {
    const response = await instance.post("api/v1/offers/", data)
    return response.data
  },
  async deleteOffer(id: number) {
    const response = await instance.delete(`api/v1/offers/${id}`)
    return response.data
  },
  async generateCourierSignature({
    offer_id,
    contract_id,
    date,
  }: {
    offer_id?: number
    contract_id?: number
    date?: string
  }) {
    const item = offer_id ? `offer_id=${offer_id}` : `contract_id=${contract_id}`
    const response = await instance.get(`api/v1/generate-courier-signature/?${item}&date=${date}`, {
      headers: {
        accept: "application/json",
        "X-CSRFToken": "jyxiRklyeOenGXe1G0oGAdJvsdAAhJRZJAgiCiXodleR7l6OZCguMfSr4vvN6lsq",
      },
      responseType: "blob",
    })
    return response
  },

  // Adition-Offers-Info
  async getOffersAdditionalInfo(start_date: string, end_date: string) {
    const response = await instance.get(
      `api/v1/offers/additional-statistics/?start_date=${start_date}&end_date=${end_date}`
    )
    return response.data
  },
  async editOffersAdditionalInfo(id: number, data: any) {
    const response = await instance.patch(`/api/v1/adition-offers-info/${id}/`, data)
    console.log("editOffersAdditionalInfo  response:", response)
    return response.data
  },

  // Messages
  async getMessages() {
    const response = await instance.get(`api/v1/messages/`)
    return response.data
  },
  async sendMessage(data: { message: string; to_user_id: string; from_user_id: string }) {
    const response = await instance.post(`api/v1/messages/`, data)
    return response.data
  },
  async markMessageAsRead(id: number) {
    const data = { revised: true }
    const response = await instance.patch(`api/v1/messages/${id}/`, data)
    return response.data
  },

  // Task
  async getTasks(filters?: string) {
    const response = await instance.get(`api/v1/tasks/?${filters || ""}`)
    return response.data
  },
  async addTask(data: IAddTask) {
    const response = await instance.post(`api/v1/tasks/`, data)
    return response.data
  },
  async editTask(id: number, data: any) {
    const response = await instance.patch(`api/v1/tasks/${id}/`, data)
    return response.data
  },
  async getTasksForCourier(ids: string) {
    const response = await instance.get(`api/v1/tasks/courier_ids=${ids}}`)
    return response.data
  },
  async deleteTask(id: number) {
    const response = await instance.delete(`api/v1/tasks/${id}/`)
    return response.data
  },

  // Couriers
  async getCouriers() {
    const response = await instance.get("api/v1/couriers/")
    return response.data
  },

  // Cars
  async getCars() {
    const response = await instance.get("api/v1/cars/")
    return response.data
  },
  async addCar(data: IAddCar) {
    const response = await instance.post("api/v1/cars/", data)
    return response.data
  },

  // Events
  async getEvents() {
    const response = await instance.get(`api/v1/events/`)
    return response.data
  },
  async getEventById(id: number) {
    const response = await instance.get(`api/v1/events/?event_id=${id}`)
    return response.data
  },
  async addEvent(data: Omit<IEvent, "id" | "image_path">) {
    const response = await instance.post(`/api/v1/events/`, data)
    return response.data
  },
  async addEventPhoto(id: number, image: any) {
    const response = await instance.post(`api/v1/image-load-for-event/?event_id=${id}`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": "UgJjmY3zUjPhvFNpOaaRR2kdPQY3AKnTuVQkqARAbCce3tfSeuPEMxxPT7yk8m5S",
      },
    })
    return response
  },

  // meetings
  async getMeetings({ date, type }: { date?: string; type: "online" | "offline" | "all" }) {
    const response = await instance.get(`api/v1/meetings/`, {
      params: {
        date,
        type: type === "all" ? undefined : type,
      },
    })

    return response.data
  },
  async addMeeting(payload: IMeetingAddBody) {
    const response = await instance.post(`api/v1/meetings/`, payload)

    return response.data as IMeetingAddResponse
  },
  async editMeeting(payload: IMeetingEditBody) {
    const response = await instance.patch(`api/v1/meetings/update/`, payload)

    return response.data as IMeetingAddResponse
  },
  async getMeetingsBooking({
    type,
    date,
    date_range_after,
    date_range_before,
  }: {
    type: "all" | "offline" | "online"
    date?: string
    date_range_after?: string
    date_range_before?: string
  }) {
    const response = await instance.get(`api/v1/meetings-booking/`, {
      params: {
        type: type === "all" ? undefined : type,
        date: date,
        date_range_after,
        date_range_before,
      },
    })

    return response.data
  },
  async cancelBookMeeting(id: number) {
    const response = await instance.delete(`api/v1/meetings-booking/${id}`)

    return response.data
  },

  // PDF
  async loadPdf(delivery_number: string, pdf_file: File) {
    try {
      await instance.post(
        `api/v1/pdf_load/?delivery_number=${delivery_number}`,
        { pdf_file: pdf_file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": "jUvebdsuoAJVB24KNmLqx6agNpIdg6mSJWeeWb4kn7Jp2qWx6YDeJ8jcpHDq5IXj",
          },
        }
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async loadPdfForTask(delivery_number: string, pdf_file: File) {
    try {
      await instance.post(
        `api/v1/for-task-pdf-load/?delivery_number=${delivery_number}`,
        { pdf_file: pdf_file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": "jUvebdsuoAJVB24KNmLqx6agNpIdg6mSJWeeWb4kn7Jp2qWx6YDeJ8jcpHDq5IXj",
          },
        }
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async loadPdfForContractTask(contract_id: string, pdf_file: File) {
    try {
      await instance.post(
        `api/v1/contract-pdf-load/?contract_id=${contract_id}`,
        { pdf_file: pdf_file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": "jUvebdsuoAJVB24KNmLqx6agNpIdg6mSJWeeWb4kn7Jp2qWx6YDeJ8jcpHDq5IXj",
          },
        }
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async createAdditionalDocument(offer_id?: number, contract_id?: number) {
    try {
      const data: { offer_id?: number; contract_id?: number } = {}
      if (offer_id) {
        data.offer_id = offer_id
      }
      if (contract_id) {
        data.contract_id = contract_id
      }

      const response = await instance.post("api/v1/documents/", data)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async uploadAdditionalDocument(document_id: number, pdf_file: File) {
    try {
      const response = await instance.post(
        `/api/v1/documents/upload/?document_id=${document_id}`,
        { document: pdf_file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": "z9AgsQqNm0xRcYf6kUOMQLFYe0taLaaqZbjgdO2DlxxlDm7TDwGA2NOUQionAMLR",
          },
        }
      )
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  // Sending confirmation to email
  async contractSendConfirmationEmail(contract_id: number) {
    try {
      const response = await instance.get(
        `api/v1/sent-email/for-contract-confirmation/?contract_id=${contract_id}`
      )
    } catch (error) {
      throw error
    }
  },
  async taskExternalItemsSendConfirmationEmail(task_id: number) {
    try {
      const response = await instance.get(
        `api/v1/sent-email/external-workers-info/?task_id=${task_id}`
      )
      console.log("taskExternalItemsSendConfirmationEmail  response:", response)
    } catch (error) {
      throw error
    }
  },

  // Posts
  async addPost(data: IPost) {
    const response = await instance.post("api/v1/posts/", data)
    return response.data
  },
  async getPostById(id: string) {
    const response = await instance.get(`api/v1/posts/${id}/`)
    return response.data
  },
  async editPost(id: string, data: Partial<FetchPost>) {
    const response = await instance.patch(`api/v1/posts/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })

    return response.data
  },

  async editPostBlock(id: string, data: Partial<FetchBlock>) {
    const response = await instance.patch(`api/v1/post-blocks/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })

    return response.data
  },

  async deletePost(id: number) {
    const response = await instance.delete(`api/v1/posts/${id}`)
    return response.data
  },

  async getTargetForTableStatistics(id: string) {
    const response: AxiosResponse<TableStatisticGoalsResponseType> = await instance.get(
      `api/v1/target-for-statistic/${id}`
    )
    return response.data
  },
  async editTargetForTableStatistics(
    id: number | string,
    data: Partial<TableStatisticGoalsResponseType>
  ) {
    const response = await instance.patch(`api/v1/target-for-statistic/${id}/`, data)
    return response
  },
}
