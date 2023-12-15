//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import { ILead, LeadsStatisticByPeriodType } from "types/tables";
import { RootStateType } from "types/index";
//API
import { serverDomain } from "services/API";

interface IInitialSate {
  payloadResponse: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ILead[];
  } | null,
  allLeads: ILead[],
  allLeadsLoadingStatus: "idle" | "loading" | "error",
  leadsStatisticByPeriod: LeadsStatisticByPeriodType | null,
  fetchLeadsStatisticByPeriodStatus: "idle" | "loading" | "error",
}

const initialState: IInitialSate = {
  payloadResponse: null,
  allLeads: [],
  allLeadsLoadingStatus: "idle",
  leadsStatisticByPeriod: null,
  fetchLeadsStatisticByPeriodStatus: "loading",
};

export const fetchAllLeads = createAsyncThunk("leads/fetchAllLeads", (_, { getState }) => {
  const { request } = useHttp();
  const state = getState() as RootStateType
  return request(state.Leads.payloadResponse?.next ? state.Leads.payloadResponse?.next.replace(/^http:/, 'https:') : `${serverDomain}api/v1/customers/`, "GET", null, {
    "Authorization":
      `Bearer ${localStorage.getItem("access")}`,
    "Content-Type": "application/json",
  })
});


export const fetchFeadsStatisticByPeriod = createAsyncThunk(
  "leads/fetchДeadsStatisticByPeriod",
  (payload:
    {
      start_date: string,
      end_date: string
    }) => {
    const { request } = useHttp();
    return request(`${serverDomain}api/v1/customers/statistic/?start_date=${payload.start_date}&end_date=${payload.end_date}`, "GET", null, {
      "Authorization":
        `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    })
  });



const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLeads.pending, (state) => {
        state.allLeadsLoadingStatus = "loading";
      })
      .addCase(fetchAllLeads.fulfilled, (state, { payload }: { payload: IInitialSate['payloadResponse'] }) => {
        if (payload) {
          state.payloadResponse = payload;
          state.allLeads = [...state.allLeads, ...payload.results];
          if (!payload.next)
            state.allLeadsLoadingStatus = "idle";
        }
      })
      .addCase(fetchAllLeads.rejected, (state) => {
        state.allLeadsLoadingStatus = "error";
      })
      .addCase(fetchFeadsStatisticByPeriod.pending, (state) => {
        state.fetchLeadsStatisticByPeriodStatus = "loading";
      })
      .addCase(fetchFeadsStatisticByPeriod.fulfilled, (state, { payload }) => {
        state.leadsStatisticByPeriod = payload;
        state.fetchLeadsStatisticByPeriodStatus = "idle";

      })
      .addCase(fetchFeadsStatisticByPeriod.rejected, (state) => {
        state.fetchLeadsStatisticByPeriodStatus = "error";
      })
  },
});

const { reducer } = ordersSlice;
export default reducer;
