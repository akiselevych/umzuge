//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  ICustomerReviewQueryResponse,
  ICustomerReview,
  ICreateCustomerReviewPayload,
  IUpdateCustomerReviewPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingCustomerReviewsSliceInitialState {
  customerReviews: ICustomerReview[];
  customerReviewsResponse: ICustomerReviewQueryResponse | null;
  fetchCustomerReviewsLoadingStatus: "idle" | "loading" | "error";
  deleteCustomerReviewsLoadingStatus: "idle" | "loading" | "error";
  createCustomerReviewsLoadingStatus: "idle" | "loading" | "error";
  updateCustomerReviewsLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingCustomerReviewsSliceInitialState = {
  customerReviews: [],
  customerReviewsResponse: null,
  fetchCustomerReviewsLoadingStatus: "loading",
  deleteCustomerReviewsLoadingStatus: "idle",
  createCustomerReviewsLoadingStatus: "idle",
  updateCustomerReviewsLoadingStatus: "idle",
};

export const fetchCustomerReviews = createAsyncThunk(
  "marketing/customerReviews/fetchCustomerReviews",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/customer-reviews/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deleteCustomerReview = createAsyncThunk(
  "marketing/customerReviews/deleteCustomerReview",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/customer-reviews/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createCustomerReview = createAsyncThunk<
  ICustomerReview,
  ICreateCustomerReviewPayload
>("marketing/customerReviews/createCustomerReview", async (payload) => {
  const { request } = useHttp();
  return request(
    `${serverDomain}api/v1/customer-reviews/`,
    "POST",
    JSON.stringify(payload),
    {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    }
  );
});

export const updateCustomerReview = createAsyncThunk<
  ICustomerReview,
  IUpdateCustomerReviewPayload
>("marketing/customerReviews/updateCustomerReview", async (payload) => {
  const { request } = useHttp();
  return request(
    `${serverDomain}api/v1/customer-reviews/${payload.id}/`,
    "PATCH",
    JSON.stringify(payload.data),
    {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    }
  );
});

export const updateCustomerReviewOrder = createAsyncThunk(
  "marketing/customerReviews/updateVupdateCustomerReviewOrderacancyOrder",
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
      `${serverDomain}api/v1/customer-reviews/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/customer-reviews/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/customer-reviews/`,
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

const marketingCustomerReviewsSlice = createSlice({
  name: "marketingCustomerReviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerReviews.pending, (state) => {
        state.fetchCustomerReviewsLoadingStatus = "loading";
      })
      .addCase(fetchCustomerReviews.fulfilled, (state, { payload }) => {
        payload as ICustomerReviewQueryResponse;
        state.customerReviews = payload.results;
        state.customerReviewsResponse = payload;
        state.fetchCustomerReviewsLoadingStatus = "idle";
      })
      .addCase(fetchCustomerReviews.rejected, (state) => {
        state.fetchCustomerReviewsLoadingStatus = "error";
      })
      .addCase(deleteCustomerReview.pending, (state) => {
        state.deleteCustomerReviewsLoadingStatus = "loading";
      })
      .addCase(deleteCustomerReview.fulfilled, (state, { payload }) => {
        state.customerReviews = state.customerReviews.filter(
          (customerReview) => customerReview.id !== payload
        );
        state.deleteCustomerReviewsLoadingStatus = "idle";
      })
      .addCase(deleteCustomerReview.rejected, (state) => {
        state.deleteCustomerReviewsLoadingStatus = "error";
      })
      .addCase(createCustomerReview.pending, (state) => {
        state.createCustomerReviewsLoadingStatus = "loading";
      })
      .addCase(createCustomerReview.fulfilled, (state, { payload }) => {
        state.customerReviews.push(payload);
        state.createCustomerReviewsLoadingStatus = "idle";
      })
      .addCase(createCustomerReview.rejected, (state) => {
        state.createCustomerReviewsLoadingStatus = "error";
      })
      .addCase(updateCustomerReview.pending, (state) => {
        state.updateCustomerReviewsLoadingStatus = "loading";
      })
      .addCase(updateCustomerReview.fulfilled, (state, { payload }) => {
        state.customerReviews = state.customerReviews.map((vac, i) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updateCustomerReviewsLoadingStatus = "idle";
      })
      .addCase(updateCustomerReview.rejected, (state) => {
        state.updateCustomerReviewsLoadingStatus = "error";
      }) //Edit order
      .addCase(updateCustomerReviewOrder.pending, (state, { payload }) => {
        state.updateCustomerReviewsLoadingStatus = "loading";
      })
      .addCase(updateCustomerReviewOrder.fulfilled, (state, { payload }) => {
        state.updateCustomerReviewsLoadingStatus = "idle";
        state.customerReviews = [...payload];
      })
      .addCase(updateCustomerReviewOrder.rejected, (state, { payload }) => {
        state.updateCustomerReviewsLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingCustomerReviewsSlice;
export default reducer;
