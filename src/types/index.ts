import { store } from "reduxFolder/store";

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface MultiRangeSliderProps {
    min: number;
    max: number;
    onChange: (values: { min: number; max: number }) => void;
    dateFormat: "Year" | "Day-Month-Year" | "Month-Year";
    maxDiffer?: number;
}
export interface ModalWindowProps {
    isModaltOpen: boolean;
    onClose?: () => void;
    setIsModaltOpen: (
        newValue: boolean | ((prevValue: boolean) => boolean)
    ) => void;
    children: React.ReactNode;
    withLogo: boolean;
    size: "small" | "large" | "medium" | "tiny";
    removeCloseButton?: boolean;
}
export interface SelectProps {
    options: { text: string; value: string }[];
    setCurrentOption: (arg: number) => void;
    currentOption: string;
    label?: string;
    disable: boolean;
}
export interface StatPanelProps {
    content: { label: string; data: string | number }[];
}

export interface AddExpenseFormProps {
    isFormOpen: boolean;
    setIsFormOpen: (
        newValue: boolean | ((prevValue: boolean) => boolean)
    ) => void;
}

export interface ToggleSwitcherProps {
    value1: string;
    value2: string;
    value3?: string;
    activeValue: string;
    setActiveValue: (arg: string) => void;
}
export interface StatistikProfitListProps {
    title: string;
    data: {
        average_price: number;
        conversion_rate: number;
        cost_per_finished_lead: number;
        cost_per_lead: number;
        cost_per_revenue: number;
        count_finished_offers: number;
        estimated_salary: number;
        expected_salary_in_month: string | number;
        leads_count: number;
        orders_count: number;
        revenue_per_finished_order: number;
        salary: number;
        total_price: number;
        total_salary: string | number;
    }[];
}
export interface NewDetailedOffersProps {
    id: number;
    date: string;
    name: string;
    net_sales: number;
    percentShare: number;
    administration: number;
    acquisition: number;
    carrier: number;
    working_hours: number;
    total_working_hours: number;
    external: number;
    work_hours_in_time: number;
    total_working_hours_externally: number;
    disposal_costs: number;
    quantity_clothes_boxes: number;
    quantity_moving_boxes: number;
    km: number;
    transportation_cost: number;
    total_cost: number;
    profit_removals: number;
    profit_percent: number;
    total_profit: number;
    second_profit_percent: number;
    global_sales_direction: number;
}
export interface OrderType {
    date: string;
    id: string;
    customer: {
        id: string;
        name: string;
    };
    notes: string;
    status: string;
}
export interface ExpenseType {
    name: string;
    expense: number;
    id: string;
}
export interface unexpectedExpensesItemType {
    invoicingParty: string;
    invoice: string;
    dateReceived: string;
    amount: string;
    dueDate: string;
    invoiceArchived: boolean;
    invoiceAudited: boolean;
    id: string;
}
export type ProfitStatistic = {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                leads_count: number;
                orders_count: number;
                count_finished_offers: number;
                conversion_rate: number;
                total_price: number;
                average_price: number;
                revenue_per_finished_order: number;
                cost_per_lead: number;
                cost_per_finished_lead: number;
                cost_per_revenue: number;
                salary: number;
                estimated_salary: number;
                total_salary: number;
                expected_salary_in_month: string | number;
            };
        };
    };
};
export interface OrdersSliceInitialState {
    orders: OrderType[];
    ordersResponse: null | {
        count: 219;
        next: string;
        previous: null;
        results: any[];
    };
    ordersLoadingStatus: "loading" | "idle" | "error";
    profitStatistic: ProfitStatistic;
    profitStatisticLoadingStatus: "loading" | "idle" | "error";
    profitStatisticCalculation: NewDetailedOffersProps[];
    generalProfitStatisticCalculation: null | {
        km: number,
        profit_in_percents: number,
        total_Acquisition_per_month: number,
        total_administration_per_month: number,
        total_costs: number,
        total_external_workers: number,
        total_external_working_time_per_worker: number,
        total_percentage_offer_for_all_sales: number,
        total_price: number,
        total_profit: number,
        total_transport_costs: number,
        total_working_time: number,
        total_working_time_external_worker: number,
        HV_zone_disposal_costs: number,
        number_of_clothing_boxes: number,
        Number_of_moving_boxes: number,
        website_percentage: number,
        email_percentage: number,
        contract_percentage: number,
    }
    constantsForStatisticCalculation: null | ConstantsForProfitCalc,
    profitStatisticCalculationLoadingStatus: "loading" | "idle" | "error";
}

export interface ConstantsForProfitCalc{
    administration: number,
    acquisition: number,
    umsatz_netto_mindest: number
}

export interface ExpensesSliceInitialState {
    expenses: ExpenseType[];
    expensesLoadingStatus: "loading" | "idle" | "error";
}
export interface unexpectedExpensesSliceInitialState {
    unexpectedExpenses: unexpectedExpensesItemType[];
    fetchUnxpectedExpensesResponse: null | {
        count: number;
        next: string;
        previous: null;
        results: any[];
    };
    unexpectedExpensesLoadingStatus: "loading" | "idle" | "error";
    setUnexpectedExpensesLoadingStatus: "loading" | "idle" | "error";
    changeUnexpectedExpensesLoadingStatus: "loading" | "idle" | "error";
}
