//libs
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  ICityQueryResponse,
  ICity,
  ICreateCityPayload,
  IUpdateCityPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingCitiesSliceInitialState {
  cities: ICity[];
  citiesResponse: ICityQueryResponse | null;
  fetchCitiesLoadingStatus: "idle" | "loading" | "error";
  deleteCitiesLoadingStatus: "idle" | "loading" | "error";
  createCitiesLoadingStatus: "idle" | "loading" | "error";
  updateCitiesLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingCitiesSliceInitialState = {
  cities: [],
  citiesResponse: null,
  fetchCitiesLoadingStatus: "loading",
  deleteCitiesLoadingStatus: "idle",
  createCitiesLoadingStatus: "idle",
  updateCitiesLoadingStatus: "idle",
};

export const fetchCities = createAsyncThunk(
  "marketing/cities/fetchCities",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/relocation-cities/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deleteCity = createAsyncThunk(
  "marketing/cities/deleteCity",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/relocation-cities/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createCity = createAsyncThunk<ICity, ICreateCityPayload>(
  "marketing/cities/createCity",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/relocation-cities/`,
      "POST",
      JSON.stringify(payload),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const updateCity = createAsyncThunk<ICity, Partial<IUpdateCityPayload>>(
  "marketing/cities/updateCity",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/relocation-cities/${payload.id}/`,
      "PATCH",
      JSON.stringify(payload.data),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const updateCityOrder = createAsyncThunk(
  "marketing/cities/updateCityOrder",
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
      `${serverDomain}api/v1/relocation-cities/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/relocation-cities/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/relocation-cities/`,
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

const marketingCitiesSlice = createSlice({
  name: "marketingCities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.fetchCitiesLoadingStatus = "loading";
      })
      .addCase(
        fetchCities.fulfilled,
        (state, { payload }: PayloadAction<ICityQueryResponse>) => {
          state.cities = payload.results;
          state.citiesResponse = payload;
          state.fetchCitiesLoadingStatus = "idle";
        }
      )
      .addCase(fetchCities.rejected, (state) => {
        state.fetchCitiesLoadingStatus = "error";
      })
      .addCase(deleteCity.pending, (state) => {
        state.deleteCitiesLoadingStatus = "loading";
      })
      .addCase(deleteCity.fulfilled, (state, { payload }) => {
        state.cities = state.cities.filter((city) => city.id !== payload);
        state.deleteCitiesLoadingStatus = "idle";
      })
      .addCase(deleteCity.rejected, (state) => {
        state.deleteCitiesLoadingStatus = "error";
      })
      .addCase(createCity.pending, (state) => {
        state.createCitiesLoadingStatus = "loading";
      })
      .addCase(createCity.fulfilled, (state, { payload }) => {
        state.cities.push(payload);
        state.createCitiesLoadingStatus = "idle";
      })
      .addCase(createCity.rejected, (state) => {
        state.createCitiesLoadingStatus = "error";
      })
      .addCase(updateCity.pending, (state) => {
        state.updateCitiesLoadingStatus = "loading";
      })
      .addCase(updateCity.fulfilled, (state, { payload }) => {
        state.cities = state.cities.map((vac) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updateCitiesLoadingStatus = "idle";
      })
      .addCase(updateCity.rejected, (state) => {
        state.updateCitiesLoadingStatus = "error";
      })
      //Edit order
      .addCase(updateCityOrder.pending, (state, { payload }) => {
        state.updateCitiesLoadingStatus = "loading";
      })
      .addCase(
        updateCityOrder.fulfilled,
        (state, { payload }: PayloadAction<ICity[]>) => {
          state.updateCitiesLoadingStatus = "idle";
          state.cities = [...payload];
        }
      )
      .addCase(updateCityOrder.rejected, (state, { payload }) => {
        state.updateCitiesLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingCitiesSlice;
export default reducer;
