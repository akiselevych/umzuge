//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  IFaqQueryResponse,
  IFaq,
  ICreateFaqPayload,
  IUpdateFaqPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingFaqSliceInitialState {
  faq: IFaq[];
  faqResponse: IFaqQueryResponse | null;
  fetchFaqLoadingStatus: "idle" | "loading" | "error";
  deleteFaqLoadingStatus: "idle" | "loading" | "error";
  createFaqLoadingStatus: "idle" | "loading" | "error";
  updateFaqLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingFaqSliceInitialState = {
  faq: [],
  faqResponse: null,
  fetchFaqLoadingStatus: "loading",
  deleteFaqLoadingStatus: "idle",
  createFaqLoadingStatus: "idle",
  updateFaqLoadingStatus: "idle",
};

export const fetchFaq = createAsyncThunk(
  "marketing/faq/fetchFaq",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next ? next.replace(/^http:/, "https:") : `${serverDomain}api/v1/faq/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deleteFaq = createAsyncThunk(
  "marketing/faq/deleteFaq",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/faq/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createFaq = createAsyncThunk<IFaq, ICreateFaqPayload>(
  "marketing/faq/createFaq",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/faq/`,
      "POST",
      JSON.stringify(payload),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const updateFaq = createAsyncThunk<IFaq, IUpdateFaqPayload>(
  "marketing/faq/updateFaq",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/faq/${payload.id}/`,
      "PATCH",
      JSON.stringify(payload.data),
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const updateFaqOrder = createAsyncThunk(
  "marketing/faq/updateFaqOrder",
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
      `${serverDomain}api/v1/faq/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/faq/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(`${serverDomain}api/v1/faq/`, "GET", null, {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    });

    return result.results;
  }
);

const marketingFaqSlice = createSlice({
  name: "marketingFaq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaq.pending, (state) => {
        state.fetchFaqLoadingStatus = "loading";
      })
      .addCase(fetchFaq.fulfilled, (state, { payload }) => {
        payload as IFaqQueryResponse;
        state.faq = payload.results;
        state.faqResponse = payload;
        state.fetchFaqLoadingStatus = "idle";
      })
      .addCase(fetchFaq.rejected, (state) => {
        state.fetchFaqLoadingStatus = "error";
      })
      .addCase(deleteFaq.pending, (state) => {
        state.deleteFaqLoadingStatus = "loading";
      })
      .addCase(deleteFaq.fulfilled, (state, { payload }) => {
        state.faq = state.faq.filter((faq) => faq.id !== payload);
        state.deleteFaqLoadingStatus = "idle";
      })
      .addCase(deleteFaq.rejected, (state) => {
        state.deleteFaqLoadingStatus = "error";
      })
      .addCase(createFaq.pending, (state) => {
        state.createFaqLoadingStatus = "loading";
      })
      .addCase(createFaq.fulfilled, (state, { payload }) => {
        state.faq.push(payload);
        state.createFaqLoadingStatus = "idle";
      })
      .addCase(createFaq.rejected, (state) => {
        state.createFaqLoadingStatus = "error";
      })
      .addCase(updateFaq.pending, (state) => {
        state.updateFaqLoadingStatus = "loading";
      })
      .addCase(updateFaq.fulfilled, (state, { payload }) => {
        state.faq = state.faq.map((vac) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updateFaqLoadingStatus = "idle";
      })
      .addCase(updateFaq.rejected, (state) => {
        state.updateFaqLoadingStatus = "error";
      }) //Edit order
      .addCase(updateFaqOrder.pending, (state, { payload }) => {
        state.updateFaqLoadingStatus = "loading";
      })
      .addCase(updateFaqOrder.fulfilled, (state, { payload }) => {
        state.updateFaqLoadingStatus = "idle";
        state.faq = [...payload];
      })
      .addCase(updateFaqOrder.rejected, (state, { payload }) => {
        state.updateFaqLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingFaqSlice;
export default reducer;
