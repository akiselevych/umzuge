import { AxiosResponse } from "axios"
import { ACCOUNTING_API, responseDataType } from "services/ACCOUNTING_API"
// Libs
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API, instance, serverDomain } from "services/API"
import { RootStateType } from "types/index"
import { IOffer, SentStatusType } from "types/offers"
import { IContract } from "types/tables"
import moment from "moment"
import { getNextPageURL } from "utils/getNextPageURL"

type InitialStateType = {
  currentAccountingTableName: SentStatusType
  accountingOffers: IOffer[]
  accountingContracts: IContract[]
  isLoading: boolean
  search: string
  tableItem: "Aufträge" | "Personaldienstleistungen"
  isLastPage: boolean
  page: number
  nextPageURL: string
}

const initialState: InitialStateType = {
  currentAccountingTableName: "TO_SEND",
  accountingOffers: [],
  accountingContracts: [],
  isLoading: false,
  search: "",
  tableItem: "Aufträge",
  isLastPage: false,
  page: 1,
  nextPageURL: "",
}

// Offers
export const getAccountingOffers = createAsyncThunk(
  "accounting/getAccountingOffers",
  async (sent_status: SentStatusType, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootStateType
      const search = state.Accounting.search
      const currentDate = state.Calendar.currentDate
      const dateAfter = moment(currentDate).startOf("month").format("YYYY-MM-DD")
      const dateBefore = moment(currentDate).endOf("month").format("YYYY-MM-DD")

      const data = await ACCOUNTING_API.getSearchedOffers(
        search,
        sent_status,
        dateAfter,
        dateBefore
      )

      return data
    } catch (error) {
      throw error
    }
  }
)
export const editAccountingOffer = createAsyncThunk(
  "accounting/editAccountingOffer",
  async (data: { id: number; new_offer_data: Partial<IOffer> }) => {
    try {
      await API.editOffer(data.id, data.new_offer_data)
      return data.id
    } catch (error) {
      throw error
    }
  }
)

// Contracts
export const getAccountingContracts = createAsyncThunk(
  "accounting/getAccountingContracts",
  async (sent_status: SentStatusType, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootStateType
      const search = state.Accounting.search
      const currentDate = state.Calendar.currentDate
      const dateAfter = moment(currentDate).startOf("month").format("YYYY-MM-DD")
      const dateBefore = moment(currentDate).endOf("month").format("YYYY-MM-DD")

      const data = await ACCOUNTING_API.getSearchContracts(
        search,
        sent_status,
        dateAfter,
        dateBefore
      )
      return data
    } catch (error) {
      throw error
    }
  }
)
export const editAccountingContract = createAsyncThunk(
  "accounting/editAccountingContract",
  async (data: { id: number; new_contract_data: Partial<IContract> }) => {
    try {
      await API.editContract(data.id, data.new_contract_data)
      return data.id
    } catch (error) {
      throw error
    }
  }
)

// LoadMore
export const getAccountingItemsNextPage = createAsyncThunk(
  "accounting/getAccountingItemsNextPage",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootStateType
      const nextPageURL = state.Accounting.nextPageURL

      const response: AxiosResponse<responseDataType<IOffer | IContract>> =
        await instance.get(nextPageURL)
      console.log("response:", response.data)

      return response.data
    } catch (error) {
      throw error
    }
  }
)

export const Accounting = createSlice({
  name: "Accounting",
  initialState,
  reducers: {
    setCurrentAccountingTableName: (
      state,
      action: PayloadAction<SentStatusType>
    ) => {
      state.currentAccountingTableName = action.payload
    },
    setAccountingSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setAccountingTableItem: (
      state,
      action: PayloadAction<"Aufträge" | "Personaldienstleistungen">
    ) => {
      state.tableItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //* Offers
      .addCase(getAccountingOffers.pending, (state) => {
        state.isLastPage = false
        state.isLoading = true
      })
      .addCase(getAccountingOffers.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getAccountingOffers.fulfilled, (state, action) => {
        state.page = 1
        state.accountingOffers = action.payload.results
        if (!action.payload.next) state.isLastPage = true
        state.nextPageURL = getNextPageURL(action.payload.next, state.page)
        state.isLoading = false
      })

      .addCase(
        editAccountingOffer.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.accountingOffers = state.accountingOffers.filter(
            (offer) => offer.id !== action.payload
          )
        }
      )

      //* Contracts
      .addCase(getAccountingContracts.pending, (state) => {
        state.isLastPage = false
        state.isLoading = true
      })
      .addCase(getAccountingContracts.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getAccountingContracts.fulfilled, (state, action) => {
        state.page = 1
        state.accountingContracts = action.payload.results
        if (!action.payload.next) state.isLastPage = true
        state.nextPageURL = getNextPageURL(action.payload.next, state.page)
        state.isLoading = false
      })

      .addCase(
        editAccountingContract.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.accountingContracts = state.accountingContracts.filter(
            (contract) => contract.id !== action.payload
          )
        }
      )

      //* LoadMore
      .addCase(getAccountingItemsNextPage.fulfilled, (state, action) => {
        state.page++
        if (state.tableItem === "Aufträge") {
          state.accountingOffers = [
            ...state.accountingOffers,
            ...(action.payload.results as IOffer[]),
          ]
        } else {
          state.accountingContracts = [
            ...state.accountingContracts,
            ...(action.payload.results as IContract[]),
          ]
        }
        if (!action.payload.next) state.isLastPage = true
        state.nextPageURL = getNextPageURL(action.payload.next, state.page)
      })
  },
})

export const {} = Accounting.actions

export default Accounting.reducer
