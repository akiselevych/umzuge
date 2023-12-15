//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  IPhotoReviewQueryResponse,
  IPhotoReview,
  ICreatePhotoReviewPayload,
  IUpdatePhotoReviewPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingPhotoReviewsSliceInitialState {
  photoReviews: IPhotoReview[];
  photoReviewsResponse: IPhotoReviewQueryResponse | null;
  fetchPhotoReviewsLoadingStatus: "idle" | "loading" | "error";
  deletePhotoReviewsLoadingStatus: "idle" | "loading" | "error";
  createPhotoReviewsLoadingStatus: "idle" | "loading" | "error";
  updatePhotoReviewsLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingPhotoReviewsSliceInitialState = {
  photoReviews: [],
  photoReviewsResponse: null,
  fetchPhotoReviewsLoadingStatus: "loading",
  deletePhotoReviewsLoadingStatus: "idle",
  createPhotoReviewsLoadingStatus: "idle",
  updatePhotoReviewsLoadingStatus: "idle",
};

export const fetchPhotoReviews = createAsyncThunk(
  "marketing/photoReviews/fetchPhotoReviews",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/our-clients/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deletePhotoReview = createAsyncThunk(
  "marketing/photoReviews/deletePhotoReview",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/our-clients/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createPhotoReview = createAsyncThunk<
  IPhotoReview,
  ICreatePhotoReviewPayload
>("marketing/photoReviews/createPhotoReview", async (payload) => {
  const { request } = useHttp();
  return request(`${serverDomain}api/v1/our-clients/`, "POST", payload, {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });
});

export const updatePhotoReview = createAsyncThunk<
  IPhotoReview,
  IUpdatePhotoReviewPayload
>("marketing/photoReviews/updatePhotoReview", async (payload) => {
  const { request } = useHttp();
  return request(
    `${serverDomain}api/v1/our-clients/${payload.id}/`,
    "PATCH",
    payload.data,
    {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    }
  );
});

export const updatePhotoReviewOrder = createAsyncThunk(
  "marketing/photoReviews/updatePhotoReviewOrder",
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
      `${serverDomain}api/v1/our-clients/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/our-clients/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/our-clients/`,
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

const marketingPhotoReviewsSlice = createSlice({
  name: "marketingPhotoReviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotoReviews.pending, (state) => {
        state.fetchPhotoReviewsLoadingStatus = "loading";
      })
      .addCase(fetchPhotoReviews.fulfilled, (state, { payload }) => {
        payload as IPhotoReviewQueryResponse;
        state.photoReviews = payload.results;
        state.photoReviewsResponse = payload;
        state.fetchPhotoReviewsLoadingStatus = "idle";
      })
      .addCase(fetchPhotoReviews.rejected, (state) => {
        state.fetchPhotoReviewsLoadingStatus = "error";
      })
      .addCase(deletePhotoReview.pending, (state) => {
        state.deletePhotoReviewsLoadingStatus = "loading";
      })
      .addCase(deletePhotoReview.fulfilled, (state, { payload }) => {
        state.photoReviews = state.photoReviews.filter(
          (photoReview) => photoReview.id !== payload
        );
        state.deletePhotoReviewsLoadingStatus = "idle";
      })
      .addCase(deletePhotoReview.rejected, (state) => {
        state.deletePhotoReviewsLoadingStatus = "error";
      })
      .addCase(createPhotoReview.pending, (state) => {
        state.createPhotoReviewsLoadingStatus = "loading";
      })
      .addCase(createPhotoReview.fulfilled, (state, { payload }) => {
        state.photoReviews.push(payload);
        state.createPhotoReviewsLoadingStatus = "idle";
      })
      .addCase(createPhotoReview.rejected, (state) => {
        state.createPhotoReviewsLoadingStatus = "error";
      })
      .addCase(updatePhotoReview.pending, (state) => {
        state.updatePhotoReviewsLoadingStatus = "loading";
      })
      .addCase(updatePhotoReview.fulfilled, (state, { payload }) => {
        state.photoReviews = state.photoReviews.map((vac, i) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updatePhotoReviewsLoadingStatus = "idle";
      })
      .addCase(updatePhotoReview.rejected, (state) => {
        state.updatePhotoReviewsLoadingStatus = "error";
      }) //Edit order
      .addCase(updatePhotoReviewOrder.pending, (state, { payload }) => {
        state.updatePhotoReviewsLoadingStatus = "loading";
      })
      .addCase(updatePhotoReviewOrder.fulfilled, (state, { payload }) => {
        state.updatePhotoReviewsLoadingStatus = "idle";
        state.photoReviews = [...payload];
      })
      .addCase(updatePhotoReviewOrder.rejected, (state, { payload }) => {
        state.updatePhotoReviewsLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingPhotoReviewsSlice;
export default reducer;
