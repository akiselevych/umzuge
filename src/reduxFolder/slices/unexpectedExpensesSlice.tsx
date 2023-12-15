//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  unexpectedExpensesSliceInitialState,
  unexpectedExpensesItemType,
} from "types";
//API
import { serverDomain } from "services/API";
import axios from "axios";

const initialState: unexpectedExpensesSliceInitialState = {
  unexpectedExpenses: [],
  fetchUnxpectedExpensesResponse: null,
  unexpectedExpensesLoadingStatus: "loading",
  setUnexpectedExpensesLoadingStatus: "idle",
  changeUnexpectedExpensesLoadingStatus: "idle"
};

export const fetchUnxpectedExpensesData = createAsyncThunk(
  "unxpectedExpenses/fetchUnxpectedExpenses",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(next ? next.replace(/^http:/, 'https:') : `${serverDomain}api/v1/unexpected-expenses/`, "GET", null, {
      "Authorization":
        `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    });
  }
);

export const addExpense = createAsyncThunk(
  "unxpectedExpenses/addExpense",
  async (payload: Partial<unexpectedExpensesItemType>) => {
    const { request } = useHttp();
    const { amount,
      dateReceived,
      dueDate,
      invoice,
      invoiceArchived,
      invoiceAudited,
      invoicingParty, } = payload

    return request(`${serverDomain}api/v1/unexpected-expenses/`, "POST", JSON.stringify({
      invoicing_party: invoicingParty,
      invoice,
      date_received: dateReceived,
      amount,
      due_date: dueDate,
      invoice_archived: invoiceArchived,
      invoice_audited: invoiceAudited,
    }), {
      "Authorization":
        `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    });
  }
);

export const deleteExpense = createAsyncThunk(
  "unxpectedExpenses/deleteExpense",
  async (payload: { id: string | number }) => {

    await axios.delete(`${serverDomain}api/v1/unexpected-expenses/${payload.id}/`, {
      headers: {
        "Authorization":
          `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    });
    return payload
  }
);

export const changeUnxpectedExpensesData = createAsyncThunk<
  unexpectedExpensesItemType,
  unexpectedExpensesItemType
>("unexpectedExpenses/unexpectedExpenses", async (payload) => {
  const { request } = useHttp();
  const { amount,
    dateReceived,
    dueDate,
    invoice,
    invoiceArchived,
    invoiceAudited,
    invoicingParty,
    id } = payload
  return request(`${serverDomain}api/v1/unexpected-expenses/${id}/`, "PATCH", JSON.stringify({
    amount,
    date_received: dateReceived,
    due_date: dueDate,
    invoice,
    invoice_archived: invoiceArchived,
    invoice_audited: invoiceAudited,
    invoicing_party: invoicingParty
  }), {
    "Authorization":
      `Bearer ${localStorage.getItem("access")}`,
    "Content-Type": "application/json",
  });
});

const expensesSlice = createSlice({
  name: "IncomingInvoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnxpectedExpensesData.pending, (state) => {
        state.unexpectedExpensesLoadingStatus = "loading";
      })
      .addCase(
        fetchUnxpectedExpensesData.fulfilled,
        (state, { payload }) => {
          state.fetchUnxpectedExpensesResponse = payload;
          state.unexpectedExpenses = state.unexpectedExpenses.concat(payload.results.map((item: any) => {
            const { amount,
              date_received,
              due_date,
              id,
              invoice,
              invoice_archived,
              invoice_audited,
              invoicing_party, } = item
            return {
              invoicingParty: invoicing_party,
              id,
              invoice,
              dateReceived: date_received,
              amount: amount,
              dueDate: due_date,
              invoiceAudited: invoice_audited,
              invoiceArchived: invoice_archived
            }
          }));
          state.unexpectedExpensesLoadingStatus = "idle";
        }
      )
      .addCase(fetchUnxpectedExpensesData.rejected, (state) => {
        state.unexpectedExpensesLoadingStatus = "error";
      })
      /////
      .addCase(addExpense.pending, (state) => {
        state.setUnexpectedExpensesLoadingStatus = "loading";
      })
      .addCase(addExpense.fulfilled,
        (state, { payload }) => {

          const { amount,
            date_received,
            due_date,
            id,
            invoice,
            invoice_archived,
            invoice_audited,
            invoicing_party, } = payload
          state.unexpectedExpenses.push({
            invoicingParty: invoicing_party,
            id,
            invoice,
            dateReceived: date_received,
            amount: amount,
            dueDate: due_date,
            invoiceAudited: invoice_audited,
            invoiceArchived: invoice_archived

          })
          state.setUnexpectedExpensesLoadingStatus = "idle";
        }
      )
      .addCase(addExpense.rejected, (state) => {
        state.setUnexpectedExpensesLoadingStatus = "error";
      })
      ////
      .addCase(changeUnxpectedExpensesData.pending, (state) => {
        state.changeUnexpectedExpensesLoadingStatus = "loading";
      })
      .addCase(
        changeUnxpectedExpensesData.fulfilled,
        (state, { payload }) => {
          const { amount,
            date_received,
            due_date,
            id,
            invoice,
            invoice_archived,
            invoice_audited,
            invoicing_party, } = payload as any
          state.unexpectedExpenses = state.unexpectedExpenses.map(
            (data) => {
              return data.id === payload.id ? {
                invoicingParty: invoicing_party,
                id,
                invoice,
                dateReceived: date_received,
                amount: amount,
                dueDate: due_date,
                invoiceAudited: invoice_audited,
                invoiceArchived: invoice_archived
              } : data;
            }
          );
        }
      )
      .addCase(changeUnxpectedExpensesData.rejected, (state) => {
        state.changeUnexpectedExpensesLoadingStatus = "error";
      })
      .addCase(deleteExpense.fulfilled, (state, { payload }) => {
        state.unexpectedExpenses = state.unexpectedExpenses.filter((item) => item.id !== payload.id)
      });
  },
});

const { reducer } = expensesSlice;
export default reducer;
