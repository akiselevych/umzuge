//libs
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
//hooks
import {useHttp} from "hooks/useHttp";
//types
import {ConstantsForProfitCalc, NewDetailedOffersProps, OrdersSliceInitialState} from "types";
//API
import {serverDomain} from "services/API";

const initialState: OrdersSliceInitialState = {
    orders: [],
    ordersResponse: null,
    ordersLoadingStatus: "idle",
    profitStatistic: {},
    profitStatisticLoadingStatus: "loading",
    profitStatisticCalculation: [],
    generalProfitStatisticCalculation: null,
    profitStatisticCalculationLoadingStatus: "loading",
    constantsForStatisticCalculation: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", (next: string | undefined) => {
    const {request} = useHttp();
    return request(next ? next.replace(/^http:/, 'https:') : `${serverDomain}api/v1/offers/`, "GET", null, {
        "Authorization":
            `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
    })
});

export const fetchProfitStatistic = createAsyncThunk("orders/fetchProfitStatistic",
    (payload: {
        endDate: string,
        startDate: string
    }) => {
        const {request} = useHttp();
        return request(`${serverDomain}api/v1/offers/statistics/?start_date=${payload.startDate}&end_date=${payload.endDate}`, "GET", null, {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        })
    });

export const fetchConstantsForCalculations = createAsyncThunk(
    "orders/fetchConstantsForCalculations",
    () => {
        const {request} = useHttp();
        return request(`${serverDomain}api/v1/target-for-statistic/?page=1`, "GET", null, {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        })
    }
)
export const updateConstantsForCalculations = createAsyncThunk(
    "orders/updateConstantsForCalculations",
    (data: Partial<ConstantsForProfitCalc>) => {
        const {request} = useHttp();
        return request(`${serverDomain}api/v1/target-for-statistic/1/`, "PATCH", JSON.stringify(data), {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        })
    }
)


export const fetchProfitStatisticCalculations = createAsyncThunk("orders/fetchStatisticCalculations",
    ({startDate, endDate}: {
        endDate: string,
        startDate: string
    }) => {
        const {request} = useHttp();
        return request(`${serverDomain}api/v1/profit-calculation/?start_date=${startDate}&end_date=${endDate}`, "POST", JSON.stringify({

        }), {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        })
    }
)
export const updateProfitStatisticCalculations = createAsyncThunk("orders/updateProfitStatisticCalculations",
    ({id,data}: {
        id: number,
        data: {
            HV_zone_disposal_costs: number,
            Number_of_boxes: number,
            Number_of_moving_boxes: number,
            transport_costs: number
        }
    }) => {
        const {request} = useHttp();
        return request(`${serverDomain}api/v1/profit-calculation/?start_date=2023-10-12&end_date=2023-11-12&offer_id=${id}`, "POST", JSON.stringify(data), {
            "Authorization":
                `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
        })
    }
)


const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.ordersLoadingStatus = "loading";
            })
            .addCase(fetchOrders.fulfilled, (state, {payload}) => {
                type fechedOrder = {
                    id: string;
                    start_date: string;
                    end_date: string;
                    delivery_status: string;
                    notes: string;
                    customer: {
                        id: string;
                        first_name: string
                        last_name: string
                    }
                }
                state.orders = [...state.orders, ...payload.results.map(({
                                                                             id,
                                                                             start_date,
                                                                             delivery_status,
                                                                             notes,
                                                                             customer
                                                                         }: fechedOrder) => ({
                    id,
                    date: start_date,
                    notes,
                    status: delivery_status,
                    customer: {id: customer.id, name: `${customer.first_name} ${customer.last_name}`}
                }))]
                state.ordersResponse = payload
                state.ordersLoadingStatus = "idle";
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.ordersLoadingStatus = "error";
            })
            .addCase(fetchProfitStatistic.pending, (state) => {
                state.profitStatisticLoadingStatus = "loading";
            })
            .addCase(fetchProfitStatistic.fulfilled, (state, {payload}) => {
                state.profitStatistic = payload.result;
                state.profitStatisticLoadingStatus = "idle";
            })
            .addCase(fetchProfitStatistic.rejected, (state) => {
                state.profitStatisticLoadingStatus = "error";
            })
            .addCase(fetchProfitStatisticCalculations.pending, (state) => {
                state.profitStatisticCalculationLoadingStatus = "loading";
            })
            .addCase(fetchProfitStatisticCalculations.fulfilled, (state, {payload}) => {
                const res = payload.result.map((obj: any) => ({
                    id: obj.id,
                    date: obj.date,
                    name: obj.name,
                    net_sales: obj.price,
                    percentShare: obj.percentage_offer_for_all_sales,
                    administration: obj.administration_per_month,
                    acquisition: obj.Acquisition_per_month,
                    carrier: obj.couriers,
                    working_hours: obj.working_time_per_couriers,
                    total_working_hours: obj.total_working_time,
                    external: obj.external_workers,
                    work_hours_in_time: obj.external_working_time_per_worker,
                    total_working_hours_externally: obj.total_working_time_external_worker,
                    disposal_costs: obj.HV_zone_disposal_costs,
                    quantity_clothes_boxes: obj.number_of_clothing_boxes,
                    quantity_moving_boxes: obj.Number_of_moving_boxes,
                    km: obj.km,
                    transportation_cost: obj.transport_costs,
                    total_cost: obj.total_costs,
                    profit_removals: obj.total_profit,
                    profit_percent: obj.profit_in_percents,
                    total_profit: obj.total_profit,
                    second_profit_percent: obj.profit_in_percents,
                    global_sales_direction: 0
                }))
                state.profitStatisticCalculation = res;
                state.generalProfitStatisticCalculation = payload.general;
                state.profitStatisticCalculationLoadingStatus = "idle";
            })
            .addCase(fetchProfitStatisticCalculations.rejected, (state) => {
                state.profitStatisticCalculationLoadingStatus = "error";
            })
            .addCase(fetchConstantsForCalculations.fulfilled, (state, {payload}) => {
                state.constantsForStatisticCalculation = {
                    administration: payload.results[0].administration,
                    acquisition: payload.results[0].acquisition,
                    umsatz_netto_mindest: payload.results[0].umsatz_netto_mindest
                };
            })
            .addCase(updateConstantsForCalculations.fulfilled, (state, {payload}) => {
                state.constantsForStatisticCalculation = {
                    administration: payload.administration,
                    acquisition: payload.acquisition,
                    umsatz_netto_mindest: payload.umsatz_netto_mindest
                };
            })
    },
});

const {reducer} = ordersSlice;
export default reducer;
