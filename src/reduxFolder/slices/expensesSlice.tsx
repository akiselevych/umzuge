//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import { ExpensesSliceInitialState, ExpenseType } from "types";
//API
import { serverDomain } from "services/API";

const initialState: ExpensesSliceInitialState = {
    expenses: [],
    expensesLoadingStatus: "loading",
};

export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", () => {
    const { request } = useHttp();
    return request(`${serverDomain}api/v1/regular-expenses/`, "GET", null, {
        "Authorization":
            `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
    });
});
export const changeExpense = createAsyncThunk<ExpenseType, ExpenseType>(
    "expenses/changeExpense",
    async (payload) => {
        const { request } = useHttp();
        return request(`${serverDomain}api/v1/regular-expenses/${payload.id}/`, "PATCH", JSON.stringify({ name: payload.name, amount: payload.expense }), {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        });
    }
);
export const addExpense = createAsyncThunk<ExpenseType, ExpenseType>(
    "expenses/addExpense",
    async (payload) => {
        const { request } = useHttp();
        return request(`${serverDomain}api/v1/regular-expenses/`, "POST", JSON.stringify({ name: payload.name, amount: payload.expense }), {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        });
    }
);

const expensesSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.expensesLoadingStatus = "loading";
            })
            .addCase(fetchExpenses.fulfilled, (state, { payload }) => {
                state.expenses = payload.results.map(
                    (item: { id: string; name: string; amount: string }) => ({
                        id: item.id,
                        name: item.name,
                        expense: +item.amount,
                    })
                );
                state.expensesLoadingStatus = "idle";
            })
            .addCase(fetchExpenses.rejected, (state) => {
                state.expensesLoadingStatus = "error";
            })
            .addCase(changeExpense.pending, (state) => {
                //some logic
            })
            .addCase(changeExpense.fulfilled, (state, { payload }) => {
                state.expenses = state.expenses.map((expense) => {
                    //@ts-ignore
                    return expense.id === payload.id ? { expense: +payload.amount, id: payload.id, name: payload.name } : expense;
                });
            })
            .addCase(changeExpense.rejected, (state) => {
                //some logic
            })
            .addCase(addExpense.pending, (state) => {
                //some logic
            })
            .addCase(addExpense.fulfilled, (state, { payload }) => {
                //@ts-ignore
                state.expenses.push({ id: payload.id, name: payload.name, expense: +payload.amount });
            })
            .addCase(addExpense.rejected, (state) => {
                //some logic
            });
    },
});

const { reducer } = expensesSlice;
export default reducer;
