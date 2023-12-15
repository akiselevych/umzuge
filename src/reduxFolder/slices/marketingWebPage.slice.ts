//libs
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//hooks
import { useHttp } from "hooks/useHttp";
//types
import {
    IWebPage,
    UpadateImagesResponseType,
    webPagesEnum,
    UpdateImagePayloadType,
    IUpdateWebPagePayload,
    UpadateWebpageResponseType,
    webPagesRepeatedBlocksEnum,
    webPagesLocalPages,
} from "components/Marketing/Website/types";
//API
import { serverDomain } from "services/API";
import axios from "axios";

interface MarketingCitiesSliceInitialState {
    pages: IWebPage[];
    currentPageName:
        | webPagesEnum
        | webPagesRepeatedBlocksEnum
        | webPagesLocalPages;
    fetchPagesLoadingStatus: "idle" | "loading" | "error";
    updatePagesLoadingStatus: "idle" | "loading" | "error";
    generateWebpageDataStatus: "idle" | "loading" | "error";
    pending_changes: boolean;
    lastWebsiteBuildStatus: string;
    lastWebsitePreBuildStatus: string;
}

const initialState: MarketingCitiesSliceInitialState = {
    pages: [],
    currentPageName:
        (localStorage.getItem(
            "marketingStaticContentActiveTab"
        ) as webPagesEnum) || webPagesEnum["Home-page"],
    fetchPagesLoadingStatus: "loading",
    updatePagesLoadingStatus: "idle",
    generateWebpageDataStatus: "idle",
    pending_changes: false,
    lastWebsiteBuildStatus: "",
    lastWebsitePreBuildStatus: "",
};

export const fetchPages = createAsyncThunk(
    "marketing/webPages/fetchPages",
    (next: string | undefined) => {
        const { request } = useHttp();
        return request(
            next
                ? next.replace(/^http:/, "https:")
                : `${serverDomain}api/v1/web-pages/`,
            "GET",
            null,
            {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
                "Content-Type": "application/json",
            }
        );
    }
);

type getPending_changes_statusPayload = {
    pending_changes: boolean;
};
export const getPending_changes_status =
    createAsyncThunk<getPending_changes_statusPayload>(
        "marketing/webPages/getPending_changes_status",
        () => {
            const { request } = useHttp();
            return request(
                `${serverDomain}api/v1/web-pages/pending_changes_status/`,
                "GET",
                null,
                {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    "Content-Type": "application/json",
                }
            );
        }
    );

export const setPending_changes_status = createAsyncThunk<
    getPending_changes_statusPayload,
    { pending_changes: boolean }
>("marketing/webPages/setPending_changes_status", (payload) => {
    const { request } = useHttp();
    return request(
        `${serverDomain}api/v1/web-pages/update_pending_changes/`,
        "PATCH",
        JSON.stringify(payload),
        {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        }
    );
});

export const getlastWebsiteBuildStatus = createAsyncThunk(
    "marketing/webPages/getlastWebsiteBuildStatus",
    async () => {
        const response = await axios.get(
            "https://api.github.com/repos/ICAPGroupgmbh/sieben-umzuege-website/actions/workflows/ci_cd.yaml/runs",
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization:
                        "Bearer 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",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );
        const data: string = response.data.workflow_runs[0].status;

        return { data };
    }
);
export const getlastWebsitePreBuildStatus = createAsyncThunk(
    "marketing/webPages/getlastWebsitePreBuildStatus",
    async () => {
        const response = await axios.get(
            "https://api.github.com/repos/ICAPGroupgmbh/sieben-umzuege-website/actions/workflows/upload_json.yml/runs",
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization:
                        "Bearer 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",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );
        const data: string = response.data.workflow_runs[0].status;

        return { data };
    }
);

export const generateWebpageData =
    createAsyncThunk<getPending_changes_statusPayload>(
        "marketing/webPages/generateWebpageData",
        async () => {
            const response = await axios.post(
                "https://faas-fra1-afec6ce7.doserverless.co/api/v1/namespaces/fn-b333d6ec-fedc-4745-bac5-6fc398835823/actions/su/json-uploader?blocking=true&result=true",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Basic YzM0ZWYwYTUtNDE2ZS00ZWViLTlkODktMTk1Y2U1MTIyOTY4OkNTOXBVRkxLRFVBMndxcDlJQnFIcUI5WXQ0THI0d0hZd0hwN0xldEdpeWQ0WXlMNzFJREtBMXB0N0JNckZxcTY=",
                    },
                }
            );
            return response.data;
        }
    );

export const updatePageImage = createAsyncThunk<
    UpadateImagesResponseType,
    UpdateImagePayloadType
>("marketing/webPages/updatePageImage", async (payload) => {
    const { request } = useHttp();
    return request(
        `${serverDomain}api/v1/web-page-images/${payload.id}/`,
        "PATCH",
        payload.data,
        {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
        }
    );
});

export const updateWebPage = createAsyncThunk<
    UpadateWebpageResponseType,
    IUpdateWebPagePayload
>("marketing/webPages/updateWebPage", async (payload) => {
    const { request } = useHttp();
    return request(
        `${serverDomain}api/v1/web-pages/${payload.id}/`,
        "PATCH",
        JSON.stringify(payload.data),
        {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        }
    );
});

const marketingWebPageSlice = createSlice({
    name: "marketingCities",
    initialState,
    reducers: {
        setCurrentTable(
            state,
            {
                payload,
            }: {
                payload:
                    | webPagesEnum
                    | webPagesRepeatedBlocksEnum
                    | webPagesLocalPages;
            }
        ) {
            state.currentPageName = payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPages.pending, (state) => {
                state.fetchPagesLoadingStatus = "loading";
            })
            .addCase(fetchPages.fulfilled, (state, { payload }) => {
                state.fetchPagesLoadingStatus = "idle";
                state.pages = payload.results;
            })
            .addCase(fetchPages.rejected, (state) => {
                state.fetchPagesLoadingStatus = "error";
            })
            .addCase(updatePageImage.pending, (state) => {
                state.updatePagesLoadingStatus = "loading";
            })
            .addCase(updatePageImage.fulfilled, (state, { payload }) => {
                state.updatePagesLoadingStatus = "idle";
                state.pending_changes = payload.pending_changes;
                state.pages = state.pages.map((page) => {
                    if (page.page_name === state.currentPageName) {
                        return {
                            ...page,
                            images: page.images.map((image) => {
                                if (image.id === payload.id) {
                                    return payload;
                                } else {
                                    return image;
                                }
                            }),
                        };
                    } else {
                        return page;
                    }
                });
            })
            .addCase(updatePageImage.rejected, (state) => {
                state.updatePagesLoadingStatus = "error";
            })
            .addCase(updateWebPage.pending, (state) => {
                state.updatePagesLoadingStatus = "loading";
            })
            .addCase(updateWebPage.fulfilled, (state, { payload }) => {
                state.updatePagesLoadingStatus = "idle";
                state.pending_changes = payload.pending_changes;
                state.pages = state.pages.map((page) => {
                    if (page.id === payload.id) {
                        return payload;
                    } else {
                        return page;
                    }
                });
            })
            .addCase(updateWebPage.rejected, (state) => {
                state.updatePagesLoadingStatus = "error";
            })
            .addCase(
                getPending_changes_status.fulfilled,
                (state, { payload }) => {
                    state.pending_changes = payload.pending_changes;
                }
            )
            .addCase(
                setPending_changes_status.fulfilled,
                (state, { payload }) => {
                    state.pending_changes = payload.pending_changes;
                }
            )
            .addCase(generateWebpageData.pending, (state) => {
                state.generateWebpageDataStatus = "loading";
            })
            .addCase(generateWebpageData.fulfilled, (state) => {
                state.pending_changes = false;
                state.generateWebpageDataStatus = "idle";
            })
            .addCase(generateWebpageData.rejected, (state) => {
                state.generateWebpageDataStatus = "error";
            })
            .addCase(
                getlastWebsiteBuildStatus.fulfilled,
                (state, { payload }) => {
                    state.lastWebsiteBuildStatus = payload.data;
                }
            )
            .addCase(
                getlastWebsitePreBuildStatus.fulfilled,
                (state, { payload }) => {
                    state.lastWebsitePreBuildStatus = payload.data;
                }
            );
    },
});

const { reducer, actions } = marketingWebPageSlice;
export const { setCurrentTable } = actions;
export default reducer;
