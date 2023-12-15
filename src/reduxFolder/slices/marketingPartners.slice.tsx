//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
  IPartnerQueryResponse,
  IPartner,
  ICreatePartnerPayload,
  IUpdatePartnerPayload,
} from "types/marketing";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingPartnersSliceInitialState {
  partners: IPartner[];
  partnersResponse: IPartnerQueryResponse | null;
  fetchPartnersLoadingStatus: "idle" | "loading" | "error";
  deletePartnersLoadingStatus: "idle" | "loading" | "error";
  createPartnersLoadingStatus: "idle" | "loading" | "error";
  updatePartnersLoadingStatus: "idle" | "loading" | "error";
}

const initialState: MarketingPartnersSliceInitialState = {
  partners: [],
  partnersResponse: null,
  fetchPartnersLoadingStatus: "loading",
  deletePartnersLoadingStatus: "idle",
  createPartnersLoadingStatus: "idle",
  updatePartnersLoadingStatus: "idle",
};

export const fetchPartners = createAsyncThunk(
  "marketing/partner-clients/fetchPartners",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^http:/, "https:")
        : `${serverDomain}api/v1/partner-clients/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const deletePartner = createAsyncThunk(
  "marketing/marketingPartners/deletePartner",
  async (id: number) => {
    await axios.delete(`${serverDomain}api/v1/partner-clients/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return id;
  }
);

export const createPartner = createAsyncThunk<IPartner, ICreatePartnerPayload>(
  "marketing/partner-clients/createPartner",
  async (payload) => {
    const { request } = useHttp();
    return request(`${serverDomain}api/v1/partner-clients/`, "POST", payload, {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    });
  }
);

export const updatePartner = createAsyncThunk<IPartner, IUpdatePartnerPayload>(
  "marketing/partner-clients/updatePartner",
  async (payload) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/partner-clients/${payload.id}/`,
      "PATCH",
      payload.data,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      }
    );
  }
);

export const updatePartnerOrder = createAsyncThunk(
  "marketing/partner-clients/updatePartnerOrder",
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
      `${serverDomain}api/v1/partner-clients/${dragItem.id}/`,
      hoveredFormData
    );

    const hoveredItemResponse = await axios.patch(
      `${serverDomain}api/v1/partner-clients/${hoverItem.id}/`,
      draggedFormData
    );

    const { request } = useHttp();
    const result = await request(
      `${serverDomain}api/v1/partner-clients/`,
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

const marketingPartnersSlice = createSlice({
  name: "marketingPartners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.fetchPartnersLoadingStatus = "loading";
      })
      .addCase(fetchPartners.fulfilled, (state, { payload }) => {
        payload as IPartnerQueryResponse;
        state.partners = payload.results;
        state.partnersResponse = payload;
        state.fetchPartnersLoadingStatus = "idle";
      })
      .addCase(fetchPartners.rejected, (state) => {
        state.fetchPartnersLoadingStatus = "error";
      })
      .addCase(deletePartner.pending, (state) => {
        state.deletePartnersLoadingStatus = "loading";
      })
      .addCase(deletePartner.fulfilled, (state, { payload }) => {
        state.partners = state.partners.filter(
          (photoPartner) => photoPartner.id !== payload
        );
        state.deletePartnersLoadingStatus = "idle";
      })
      .addCase(deletePartner.rejected, (state) => {
        state.deletePartnersLoadingStatus = "error";
      })
      .addCase(createPartner.pending, (state) => {
        state.createPartnersLoadingStatus = "loading";
      })
      .addCase(createPartner.fulfilled, (state, { payload }) => {
        state.partners.push(payload);
        state.createPartnersLoadingStatus = "idle";
      })
      .addCase(createPartner.rejected, (state) => {
        state.createPartnersLoadingStatus = "error";
      })
      .addCase(updatePartner.pending, (state) => {
        state.updatePartnersLoadingStatus = "loading";
      })
      .addCase(updatePartner.fulfilled, (state, { payload }) => {
        state.partners = state.partners.map((vac, i) => {
          if (vac.id === payload.id) {
            return payload;
          }
          return vac;
        });
        state.updatePartnersLoadingStatus = "idle";
      })
      .addCase(updatePartner.rejected, (state) => {
        state.updatePartnersLoadingStatus = "error";
      }) //Edit order
      .addCase(updatePartnerOrder.pending, (state, { payload }) => {
        state.updatePartnersLoadingStatus = "loading";
      })
      .addCase(updatePartnerOrder.fulfilled, (state, { payload }) => {
        state.updatePartnersLoadingStatus = "idle";
        state.partners = [...payload];
      })
      .addCase(updatePartnerOrder.rejected, (state, { payload }) => {
        state.updatePartnersLoadingStatus = "error";
      });
  },
});

const { reducer } = marketingPartnersSlice;
export default reducer;
