//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  IEmployeeQueryResponse,
  IEmployee,
  ICreateEmployeePayload,
  IUpdateEmployeePayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingEmployeesSliceInitialState {
  employees: IEmployee[];
  employeesResponse: IEmployeeQueryResponse | null;
  fetchEmployeesLoadingStatus: "idle" | "loading" | "error";
  deleteEmployeesLoadingStatus: "idle" | "loading" | "error";
  createEmployeesLoadingStatus: "idle" | "loading" | "error";
  updateEmployeesLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingEmployeesSliceInitialState = {
  employees: [],
  employeesResponse: null,
  fetchEmployeesLoadingStatus: "loading",
  deleteEmployeesLoadingStatus: "idle",
  createEmployeesLoadingStatus: "idle",
  updateEmployeesLoadingStatus: "idle",
};

export const fetchEmployees = createAsyncThunk(
  "marketing/employees/fetchEmployees",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/our-team/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deleteEmployee = createAsyncThunk(
  "marketing/employees/deleteEmployee",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/our-team/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createEmployee = createAsyncThunk<
  IEmployee,
  ICreateEmployeePayload
>("marketing/employees/createEmployee", async (payload) => {
  const { request } = useHttp();
  return request(`${serverDomain}api/v1/our-team/`, "POST", payload, {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });
});

export const updateEmployee = createAsyncThunk<
  IEmployee,
  IUpdateEmployeePayload
>("marketing/employees/updateEmployee", async (payload) => {
  const { request } = useHttp();
  return request(
    `${serverDomain}api/v1/our-team/${payload.id}/`,
    "PATCH",
    payload.data,
    {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    }
  );
});

export const updateEmployeeOrder = createAsyncThunk(
  "marketing/employees/updateEmployeeOrder",
  async (data: {
    dragItem: {
      id: number;
      order: number;
    };
    hoverItem: {
      id: number;
      order: number;
    };
  }) => {
    const { dragItem, hoverItem } = data;

    const draggedFormData = new FormData();
    draggedFormData.append("order", dragItem.order.toString());

    const hoveredFormData = new FormData();
    hoveredFormData.append("order", hoverItem.order.toString());

    const draggedItemResponse = await axios.patch(
      `${serverDomain}api/v1/our-team/${dragItem.id}/`,
      hoveredFormData
    );

    console.log(dragItem.id, hoverItem.id);

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/our-team/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/our-team/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );

    return result.results;
  }
);

const marketingEmployeesSlice = createSlice({
  name: "marketingEmployees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.fetchEmployeesLoadingStatus = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, { payload }) => {
        payload as IEmployeeQueryResponse;
        state.employees = payload.results;
        state.employeesResponse = payload;
        state.fetchEmployeesLoadingStatus = "idle";
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.fetchEmployeesLoadingStatus = "error";
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteEmployeesLoadingStatus = "loading";
      })
      .addCase(deleteEmployee.fulfilled, (state, { payload }) => {
        state.employees = state.employees.filter(
          (employee) => employee.id !== payload
        );
        state.deleteEmployeesLoadingStatus = "idle";
      })
      .addCase(deleteEmployee.rejected, (state) => {
        state.deleteEmployeesLoadingStatus = "error";
      })
      .addCase(createEmployee.pending, (state) => {
        state.createEmployeesLoadingStatus = "loading";
      })
      .addCase(createEmployee.fulfilled, (state, { payload }) => {
        state.employees.push(payload);
        state.createEmployeesLoadingStatus = "idle";
      })
      .addCase(createEmployee.rejected, (state) => {
        state.createEmployeesLoadingStatus = "error";
      })
      .addCase(updateEmployee.pending, (state) => {
        state.updateEmployeesLoadingStatus = "loading";
      })
      .addCase(updateEmployee.fulfilled, (state, { payload }) => {
        state.employees = state.employees.map((vac, i) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updateEmployeesLoadingStatus = "idle";
      })
      .addCase(updateEmployee.rejected, (state) => {
        state.updateEmployeesLoadingStatus = "error";
      })
      //Edit order
      .addCase(updateEmployeeOrder.pending, (state, { payload }) => {
        state.updateEmployeesLoadingStatus = "loading";
      })
      .addCase(updateEmployeeOrder.fulfilled, (state, { payload }) => {
        state.updateEmployeesLoadingStatus = "idle";
        state.employees = [...payload];
      })
      .addCase(updateEmployeeOrder.rejected, (state, { payload }) => {
        state.updateEmployeesLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingEmployeesSlice;
export default reducer;
