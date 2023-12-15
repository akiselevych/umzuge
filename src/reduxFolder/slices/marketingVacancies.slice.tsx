//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  IVacancyQueryResponse,
  IVacancy,
  ICreateVacancyPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingVacanciesSliceInitialState {
  vacancies: IVacancy[];
  vacanciesResponse: IVacancyQueryResponse | null;
  fetchVacanciesLoadingStatus: "idle" | "loading" | "error";
  deleteVacanciesLoadingStatus: "idle" | "loading" | "error";
  createVacanciesLoadingStatus: "idle" | "loading" | "error";
  updateVacanciesLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingVacanciesSliceInitialState = {
  vacancies: [],
  vacanciesResponse: null,
  fetchVacanciesLoadingStatus: "loading",
  deleteVacanciesLoadingStatus: "idle",
  createVacanciesLoadingStatus: "idle",
  updateVacanciesLoadingStatus: "idle",
};

export const fetchVacancies = createAsyncThunk(
  "marketing/vacancies/fetchVacancies",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/vacancy/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deleteVacancy = createAsyncThunk(
  "marketing/vacancies/deleteVacancy",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/vacancy/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createVacancy = createAsyncThunk<IVacancy, ICreateVacancyPayload>(
  "marketing/vacancies/createVacancy",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/vacancy/`,
      "POST",
      JSON.stringify(payload),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const updateVacancy = createAsyncThunk<
  IVacancy,
  Partial<ICreateVacancyPayload>
>("marketing/vacancies/updateVacancy", async (payload) => {
  const { request } = useHttp();
  return request(
    `${serverDomain}api/v1/vacancy/${payload.id}/`,
    "PATCH",
    JSON.stringify(payload),
    {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    }
  );
});

export const updateVacancyOrder = createAsyncThunk(
  "marketing/vacancies/updateVacancyOrder",
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
      `${serverDomain}api/v1/vacancy/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/vacancy/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/vacancy/`,
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

const marketingVacanciesSlice = createSlice({
  name: "marketingVacancies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.fetchVacanciesLoadingStatus = "loading";
      })
      .addCase(fetchVacancies.fulfilled, (state, { payload }) => {
        payload as IVacancyQueryResponse;
        state.vacancies = payload.results;
        state.vacanciesResponse = payload;
        state.fetchVacanciesLoadingStatus = "idle";
      })
      .addCase(fetchVacancies.rejected, (state) => {
        state.fetchVacanciesLoadingStatus = "error";
      })
      .addCase(deleteVacancy.pending, (state) => {
        state.deleteVacanciesLoadingStatus = "loading";
      })
      .addCase(deleteVacancy.fulfilled, (state, { payload }) => {
        state.vacancies = state.vacancies.filter(
          (vacancy) => vacancy.id !== payload
        );
        state.deleteVacanciesLoadingStatus = "idle";
      })
      .addCase(deleteVacancy.rejected, (state) => {
        state.deleteVacanciesLoadingStatus = "error";
      })
      .addCase(createVacancy.pending, (state) => {
        state.createVacanciesLoadingStatus = "loading";
      })
      .addCase(createVacancy.fulfilled, (state, { payload }) => {
        state.vacancies.push(payload);
        state.createVacanciesLoadingStatus = "idle";
      })
      .addCase(createVacancy.rejected, (state) => {
        state.createVacanciesLoadingStatus = "error";
      })
      .addCase(updateVacancy.pending, (state) => {
        state.updateVacanciesLoadingStatus = "loading";
      })
      .addCase(updateVacancy.fulfilled, (state, { payload }) => {
        state.vacancies = state.vacancies.map((vac, i) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updateVacanciesLoadingStatus = "idle";
      })
      .addCase(updateVacancy.rejected, (state) => {
        state.updateVacanciesLoadingStatus = "error";
      })
      //Edit order
      .addCase(updateVacancyOrder.pending, (state, { payload }) => {
        state.updateVacanciesLoadingStatus = "loading";
      })
      .addCase(updateVacancyOrder.fulfilled, (state, { payload }) => {
        state.updateVacanciesLoadingStatus = "idle";
        state.vacancies = [...payload];
      })
      .addCase(updateVacancyOrder.rejected, (state, { payload }) => {
        state.updateVacanciesLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingVacanciesSlice;
export default reducer;
