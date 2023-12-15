import { IOffer } from "types/offers"
import { serverDomain } from "services/API"
import { useHttp } from "hooks/useHttp"
import {
  ContractDisplayCategoriesType,
  CreateEventType,
  IAddCar,
  ICar,
  ICompany,
  IContract,
  ICourier,
  IEditContract,
  IEmployee,
  IEvent,
  LeadDisplayCategoriesType,
  OfferDisplayCategoriesType,
  ResponseType,
  TableNameType,
} from "./../../types/tables"
// Libs
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
// Types
import { ITables, ILead } from "types/tables"
// Services
import { API } from "services/API"
import { AppDispatch, RootStateType } from "types"
import { getQueryString } from "utils/getQueryString"

type InitialStateType = {
  tables: ITables
  currentTableName: TableNameType
  couriers: ICourier[]
  isLoading: boolean
  events: IEvent[]
  cars: ICar[]
  companies: ICompany[]
  currentPage: number
  lastRequestFilters: string
  isLastPage: boolean
  leadDisplayCategory: LeadDisplayCategoriesType
  offerDisplayCategory: OfferDisplayCategoriesType
  contractDisplayCategory: ContractDisplayCategoriesType
}

const initialState: InitialStateType = {
  tables: {
    Employees: [],
    Leads: [],
    Offers: [],
    Contracts: [],
    Orders: [],
  },
  companies: [],
  currentTableName: (localStorage.getItem("currentTable") as TableNameType) || null,
  couriers: [],
  isLoading: false,
  events: [],
  cars: [],
  currentPage: 1,
  lastRequestFilters: "",
  isLastPage: false,
  leadDisplayCategory: "Active",
  offerDisplayCategory: "All",
  contractDisplayCategory: "Pending",
}

const pagginationNumber = 50

// Leads
export const getLeads = createAsyncThunk(
  "table/getLeads",
  async (filters?: {} | undefined) => {
    try {
      let filtersString
      if (filters) {
        filtersString = getQueryString(filters)
      }
      const response: ResponseType<ILead> = await API.getLeads(filtersString)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const getSearchLeads = createAsyncThunk(
  "table/getSearchLeads",
  async (search: string) => {
    try {
      const response: ResponseType<ILead> = await API.getSearchLeads(search)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const editLead = createAsyncThunk(
  "table/editLead",
  async (props: { id: number; data: Partial<ILead> }) => {
    try {
      const response = await API.editLead(props.id, props.data)
      return { id: props.id, data: response }
    } catch (error) {
      console.log(error)
    }
  }
)
export const addLead = createAsyncThunk(
  "table/addLead",
  async (props: { data: any; dispatch: AppDispatch }) => {
    try {
      await API.addNewLead(props.data)
      await props.dispatch(getLeads())
    } catch (error) {
      console.log(error)
    }
  }
)
export const loadMoreLeads = createAsyncThunk(
  "table/loadMoreLeads",
  async (_, { getState }) => {
    const state = getState() as RootStateType
    if (state.Table.isLastPage) {
      return null
    }

    try {
      const response: ResponseType<ILead> = await API.getLeads(
        state.Table.lastRequestFilters,
        state.Table.currentPage + 1
      )
      return response
    } catch (error) {
      throw error
    }
  }
)

// Employess
export const getEmployees = createAsyncThunk(
  "table/getEmployees",
  async (role?: string | undefined) => {
    try {
      const response = await API.getEmployees(role)
      return response.results
    } catch (error) {
      console.log(error)
    }
  }
)
export const editEmployee = createAsyncThunk(
  "table/editEmployee",
  async (props: { id: number; data: Partial<IEmployee> & { image?: any } }) => {
    try {
      const response = await API.editEmployee(props.id, props.data)
      let imageResponse
      if (props.data.image && typeof props.data.image !== "string") {
        imageResponse = await API.addEmloyeePhoto(response.id, props.data.image)
      }
      return {
        id: props.id,
        data: response,
        imageData: imageResponse?.data,
      }
    } catch (error) {
      console.log(error)
    }
  }
)
export const addEmployee = createAsyncThunk(
  "table/addEmployee",
  async (props: { data: any; dispatch: AppDispatch }) => {
    try {
      const response = await API.addNewEmployee(props.data)
      if (props.data.image && typeof props.data.image !== "string") {
        await API.addEmloyeePhoto(response.data.id, props.data.image)
      }
      await props.dispatch(getEmployees())
      return response.data
    } catch (error) {
      throw error
    }
  }
)
export const changeEmployeePassword = createAsyncThunk(
  "table/changeEmployeePassword",
  async (props: {
    id: number
    data: { old_password: string; new_password: string }
  }) => {
    try {
      const response = await API.changeEmployeePassword(props.id, props.data)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)

// Bonuses
export const getBonusesForEmployee = createAsyncThunk(
  "table/getBonusesForEmployee",
  async (props: {
    employee_id: string
    dateAfter?: string
    dateBefore?: string
  }) => {
    try {
      const response = await API.getBonuses(
        props.employee_id,
        props.dateAfter || "",
        props.dateBefore || ""
      )
      return response.results
    } catch (error) {
      console.log(error)
    }
  }
)
export const addBonus = createAsyncThunk(
  "table/addBonus",
  async (data: { employee_id: number; bonuses: number; date: string }) => {
    try {
      const response = await API.addBonus(data)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const editBonus = createAsyncThunk("table/editBonus", async (data: any) => {
  try {
    const response = await API.editBonus(data)
    return response
  } catch (error) {
    console.log(error)
  }
})

// Orders
export const getOrders = createAsyncThunk("table/getOrders", async () => {
  try {
    const response: ResponseType<IOffer> = await API.getOffers(
      "delivery_status=ACCEPTED"
    )
    return response
  } catch (error) {
    console.log(error)
  }
})
export const getSearchOrders = createAsyncThunk(
  "table/getSearchOrders",
  async (search: string) => {
    try {
      const response: ResponseType<IOffer> = await API.getSearchOffers(search, true)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const loadMoreOrders = createAsyncThunk(
  "table/loadMoreOders",
  async (_, { getState }) => {
    const state = getState() as RootStateType
    if (state.Table.isLastPage) {
      return null
    }

    try {
      const response: ResponseType<IOffer> = await API.getOffers(
        state.Table.lastRequestFilters + "delivery_status=ACCEPTED",
        state.Table.currentPage + 1
      )
      return response
    } catch (error) {
      throw error
    }
  }
)

// Offers
export const getOffers = createAsyncThunk(
  "table/getOffers",
  async (
    filters:
      | {
          is_archived?: boolean
          start_date_after?: string
          start_date_before?: string
          delivery_status?: string
          sale_man_ids?: string
        }
      | undefined
  ) => {
    try {
      let filtersString
      if (filters) {
        filtersString = getQueryString(filters)
      }
      const response: ResponseType<IOffer> = await API.getOffers(filtersString)
      return response
    } catch (error) {
      throw error
    }
  }
)
export const getSearchOffers = createAsyncThunk(
  "table/getSearchOffers",
  async (search: string) => {
    try {
      const response: ResponseType<IOffer> = await API.getSearchOffers(search)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const editOffer = createAsyncThunk(
  "table/editOffer",
  async (props: { id: number; data: any }) => {
    try {
      const response = await API.editOffer(props.id, props.data)
      return { id: props.id, data: response }
    } catch (error) {
      console.log(error)
    }
  }
)
export const addOffer = createAsyncThunk(
  "table/addOffer",
  async (props: { data: any; dispatch: AppDispatch }) => {
    try {
      const response = await API.addOffer(props.data)
      await props.dispatch(getOffers())
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const loadMoreOffers = createAsyncThunk(
  "table/loadMoreOffers",
  async (_, { getState }) => {
    const state = getState() as RootStateType
    if (state.Table.isLastPage) {
      return null
    }

    try {
      const response: ResponseType<IOffer> = await API.getOffers(
        state.Table.lastRequestFilters,
        state.Table.currentPage + 1
      )
      return response
    } catch (error) {
      throw error
    }
  }
)
export const getOffersAdditionalInfo = createAsyncThunk(
  "table/getOffersAdditionalInfo",
  async (props: { start_date: string; end_date: string }) => {
    try {
      const response = await API.getOffersAdditionalInfo(
        props.start_date,
        props.end_date
      )
      return response
    } catch (error) {
      throw error
    }
  }
)
export const editOffersAdditionalInfo = createAsyncThunk(
  "table/editOffersAdditionalInfo",
  async (props: { id: number; data: any }) => {
    try {
      const response = await API.editOffersAdditionalInfo(props.id, props.data)
      return response
    } catch (error) {
      throw error
    }
  }
)

// Couriers
export const getCouriers = createAsyncThunk("table/getCouriers", async () => {
  try {
    const response = await API.getCouriers()
    return response.results
  } catch (error) {
    console.log(error)
  }
})

// Cars
export const getCars = createAsyncThunk("table/getCars", async () => {
  try {
    const response = await API.getCars()
    return response.results
  } catch (error) {
    console.log(error)
  }
})
export const addCar = createAsyncThunk("table/addCar", async (data: IAddCar) => {
  try {
    const response = await API.addCar(data)
    return response
  } catch (error) {
    console.log(error)
  }
})

// Companies
export const getCompanies = createAsyncThunk("table/getCompanies", async () => {
  try {
    let allCompanies: ICompany[] = []

    let response = await API.getCompanies()
    allCompanies = [...allCompanies, ...response.results]
    while (response.next) {
      const nextResponse = await API.getCompanies()
      allCompanies = [...allCompanies, ...nextResponse.results]
      response = nextResponse
    }

    return allCompanies
  } catch (error) {
    console.log(error)
  }
})
export const addCompany = createAsyncThunk(
  "table/addCompany",
  async (data: Partial<ICompany>) => {
    try {
      const response = await API.addCompany(data)
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const editCompany = createAsyncThunk(
  "table/editCompany",
  async (payload: { id: number | string; data: any }) => {
    const { request } = useHttp()
    return request(
      `${serverDomain}api/v1/companies/${payload.id}/`,
      "PATCH",
      JSON.stringify(payload.data),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    )
  }
)

// Contracts
export const getContracts = createAsyncThunk(
  "table/getContracts",
  async (filters?: {} | undefined) => {
    try {
      let filtersString
      if (filters) {
        filtersString = getQueryString(filters, false)
      }
      const response = await API.getContracts(filtersString)
      return response
    } catch (error) {
      throw error
    }
  }
)
export const editContract = createAsyncThunk(
  "table/editContract",
  async (props: { id: number; data: Partial<IEditContract> }) => {
    try {
      await API.editContract(props.id, props.data)
      const response = await API.getContractById(props.id)
      return { id: props.id, data: response }
    } catch (error) {
      throw error
    }
  }
)
export const addContract = createAsyncThunk(
  "table/addContract",
  async (props: { data: IEditContract; dispatch: AppDispatch }) => {
    try {
      const response = await API.addContract(props.data)
      await props.dispatch(getContracts({ status: "PENDING" }))
      return response
    } catch (error) {
      console.log(error)
    }
  }
)
export const loadMoreContracts = createAsyncThunk(
  "table/loadMoreContracts",
  async (_, { getState }) => {
    const state = getState() as RootStateType
    if (state.Table.isLastPage) {
      return null
    }

    try {
      const response: ResponseType<IContract> = await API.getContracts(
        state.Table.lastRequestFilters,
        state.Table.currentPage + 1
      )
      return response
    } catch (error) {
      throw error
    }
  }
)

// Events
export const getEvents = createAsyncThunk("table/getEvents", async () => {
  try {
    const response = await API.getEvents()
    return response.results
  } catch (error) {
    console.log(error)
  }
})

export const addEvent = createAsyncThunk(
  "table/addEvent",
  async (data: CreateEventType) => {
    try {
      const eventResponse = await API.addEvent(data)
      if (data.image) {
        await API.addEventPhoto(eventResponse.id, data.image)
      }
      const response = await API.getEvents()
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }
)

export const Table = createSlice({
  name: "Table",
  initialState,
  reducers: {
    setCurrentTableName(state, action: PayloadAction<TableNameType>) {
      state.currentTableName = action.payload
      localStorage.setItem("currentTable", action.payload)
    },
    filterLeads(state, action: PayloadAction<string>) {
      state.tables.Leads = state.tables.Leads.filter(
        (lead) => lead.id !== action.payload
      )
    },
    filterOffers(state, action: PayloadAction<number>) {
      state.tables.Offers = state.tables.Offers.filter(
        (offer) => +offer.id !== +action.payload
      )
    },
    filterContracts(state, action: PayloadAction<number>) {
      state.tables.Contracts = state.tables.Contracts.filter(
        (contract) => +contract.id !== +action.payload
      )
    },
    setLeadDisplayCategory(state, action: PayloadAction<LeadDisplayCategoriesType>) {
      state.leadDisplayCategory = action.payload
    },
    setOfferDisplayCategory(
      state,
      action: PayloadAction<OfferDisplayCategoriesType>
    ) {
      state.offerDisplayCategory = action.payload
    },
    setContractDisplayCategory(
      state,
      action: PayloadAction<ContractDisplayCategoriesType>
    ) {
      state.contractDisplayCategory = action.payload
    },
		filterCompnies(state, action: PayloadAction<number>) {
			state.companies = state.companies.filter(
				(company) => +company.id !== +action.payload
			)
		}
  },
  extraReducers(builder) {
    // Leads
    builder.addCase(getLeads.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Leads = action.payload.results
      state.currentPage = 1
      state.lastRequestFilters =
        action.payload.next?.split("?")[1].replace("page=", "") || ""
      state.isLastPage = !action.payload.next
    })
    builder.addCase(getLeads.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(loadMoreLeads.fulfilled, (state, action) => {
      if (!action.payload) return
      state.tables.Leads = [...state.tables.Leads, ...action.payload.results]
      state.currentPage = state.currentPage + 1
      state.isLastPage = !action.payload.next
    })

    builder.addCase(getSearchLeads.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getSearchLeads.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Leads = action.payload.results
      state.currentPage = 1
      state.isLastPage = !action.payload.next
    })
    builder.addCase(getSearchLeads.rejected, (state) => {
      state.isLoading = false
    })

    // Orders
    builder.addCase(getOrders.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Orders = action.payload.results
      state.currentPage = 1
      state.lastRequestFilters =
        action.payload.next?.split("?")[1].replace("page=", "") || ""
      state.isLastPage = !action.payload.next
    })
    builder.addCase(getSearchOrders.fulfilled, (state, action) => {
      if (!action.payload) return
      state.tables.Orders = action.payload.results
      state.currentPage = 1
      state.isLastPage = !action.payload.next
    })
    builder.addCase(loadMoreOrders.fulfilled, (state, action) => {
      if (!action.payload) return
      state.tables.Orders = [...state.tables.Orders, ...action.payload.results]
      state.currentPage = state.currentPage + 1
      state.lastRequestFilters =
        action.payload.next?.split("?")[1].replace("page=", "") || ""
      state.isLastPage = !action.payload.next
    })

    // Offers
    builder.addCase(getOffers.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getOffers.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Offers = action.payload.results
      state.currentPage = 1
      state.lastRequestFilters =
        action.payload.next?.split("?")[1].replace("page=", "") || ""
      state.isLastPage = !action.payload.next
    })
    builder.addCase(getOffers.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(loadMoreOffers.fulfilled, (state, action) => {
      if (!action.payload) return
      state.tables.Offers = [...state.tables.Offers, ...action.payload.results]
      state.currentPage = state.currentPage + 1
      state.isLastPage = !action.payload.next
    })

    builder.addCase(getSearchOffers.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getSearchOffers.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Offers = action.payload.results
      state.currentPage = 1
      state.isLastPage = !action.payload.next
    })
    builder.addCase(getSearchOffers.rejected, (state) => {
      state.isLoading = false
    })

    // Companies
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.companies = action.payload || []
    })
    builder.addCase(addCompany.fulfilled, (state, action) => {
      state.companies = [...state.companies, action.payload]
    })
    builder.addCase(editCompany.fulfilled, (state, { payload }) => {
      state.companies = state.companies.map((company) =>
        company.id === payload.id ? payload : company
      )
    })
    // Contracts
    builder.addCase(getContracts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getContracts.fulfilled, (state, action) => {
      state.isLoading = false
      if (!action.payload) return
      state.tables.Contracts = action.payload.results
      state.currentPage = 1
      state.lastRequestFilters =
        action.payload.next?.split("?")[1].replace("page=", "") || ""
      state.isLastPage = !action.payload.next
    })
    builder.addCase(addContract.fulfilled, (state) => {
      state.contractDisplayCategory = "Pending"
    })
    builder.addCase(loadMoreContracts.fulfilled, (state, action) => {
      if (!action.payload) return
      state.tables.Contracts = [...state.tables.Contracts, ...action.payload.results]
      state.currentPage = state.currentPage + 1
      state.isLastPage = !action.payload.next
    })
    builder.addCase(editContract.fulfilled, (state, action) => {
      let contractIndex = state.tables.Contracts.findIndex(
        (contract) => contract.id === action.payload?.id
      )
      if (contractIndex === -1) return
      state.tables.Contracts[contractIndex] = {
        ...state.tables.Contracts[contractIndex],
        ...action.payload?.data,
      }
    })

    // Employees
    builder.addCase(getEmployees.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.tables.Employees = action.payload
      state.isLoading = false
    })
    builder.addCase(getEmployees.rejected, (state) => {
      state.isLoading = false
    })

    // Couriers
    builder.addCase(getCouriers.fulfilled, (state, action) => {
      state.couriers = action.payload
    })

    // Cars
    builder.addCase(getCars.fulfilled, (state, action) => {
      state.cars = action.payload
    })

    // Events
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.events = action.payload.sort((a: any, b: any) => {
        return +new Date(b.date) - +new Date(a.date)
      })
    })
    builder.addCase(addEvent.fulfilled, (state, action) => {
      state.events = action.payload.results.sort((a: any, b: any) => {
        return +new Date(b.date) - +new Date(a.date)
      })
    })
    builder.addCase(editBonus.fulfilled, (state, action) => {
      let employeeId = state.tables.Employees.findIndex(
        (emp) => +emp.id === action.payload?.employee_id
      )
      if (employeeId !== undefined) {
				state.tables.Employees[employeeId].bonus = {
					id: action.payload.id,
          count: action.payload?.bonuses,
        }
      }
    })
    builder.addCase(editEmployee.fulfilled, (state, action) => {
      let employee = state.tables.Employees.findIndex(
        (emp) => +emp.id === action.payload?.id
      )
      if (employee !== undefined) {
        state.tables.Employees[employee] = {
          ...state.tables.Employees[employee],
          ...action.payload?.data,
          ...(action.payload?.imageData?.url && {
            image_path: action.payload.imageData.url,
          }),
        }
      }
    })
    builder.addCase(editLead.fulfilled, (state, action) => {
      const lead = state.tables.Leads.findIndex((l) => +l.id === action.payload?.id)
      if (lead !== -1) {
        state.tables.Leads[lead] = {
          ...state.tables.Leads[lead],
          ...action.payload?.data,
        }
      }
    })
    builder.addCase(editOffer.fulfilled, (state, action) => {
      const offer = state.tables.Offers.findIndex(
        (o) => +o.id === action.payload?.id
      )
      if (offer !== -1) {
        state.tables.Offers[offer] = {
          ...state.tables.Offers[offer],
          ...action.payload?.data,
        }
      }
      const order = state.tables.Orders.findIndex(
        (o) => +o.id === action.payload?.id
      )
      if (order !== -1) {
        state.tables.Orders[order] = {
          ...state.tables.Orders[order],
          ...action.payload?.data,
        }
      }
    })
  },
})

export const { setCurrentTableName } = Table.actions

export default Table.reducer
