import {
    AdditionalDocumentType,
    IOffer,
    ISaleMan,
    SentStatusType,
} from "./offers";
import { IUser } from "./user";
import { AxiosResponse } from "axios";

export interface ITables {
    Employees: IEmployee[];
    Leads: ILead[];
    Offers: IOffer[];
    Contracts: IContract[];
    Orders: IOffer[];
}

export type TableNameType =
    | "Employees"
    | "Leads"
    | "Offers"
    | "Contracts"
    | "Orders";
export type LeadDisplayCategoriesType = "Active" | "Archived" | "Canceled";
export type OfferDisplayCategoriesType = "All" | "Archived";
export type ContractDisplayCategoriesType = "Accepted" | "Pending" | "Archived";

export interface TableItemProps {
    tables: ITables;
    currentTableName: TableNameType;
}

export type ResponseType<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export interface ILead {
    id: string;
    kw: number;
    last_name: string;
    first_name: string;
    email: string;
    phone: string;
    platform: string;
    preferred_appointment: string;
    lead_received_on: string;
    date_of_contact_attempt: string;

    by_phone: boolean;
    by_messanger: boolean;
    by_email: boolean;
    online_viewing: boolean;
    on_site_visit: boolean;
    by_correspondence: boolean;

    follow_up_date: string;
    notes: string;
    status: "Canceled" | "Archived" | "Active" | "Arranged";
}

export type LeadsplatformsType =
    | "365"
    | "B2B"
    | "B2C"
    | "E-Mail"
    | "Telefon"
    | "Umzugspreis";

export interface LeadsStatisticByPeriodType {
    current: Record<LeadsplatformsType, number>;
    previous: Record<LeadsplatformsType, number>;
}

export interface ICompany {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    workers_count: number;
    notes: string;
    rank: "A" | "B" | "C";
    // additional_info: {
    //     cars: {
    //         id: string | number;
    //         name: string;
    //         wage: string;
    //     }[];
    //     workers: {
    //         name: string;
    //         id: string | number;
    //         comingFee: string;
    //         goingFee: string;
    //         hourlyWage: string;
    //     }[];
    // };
}

export type contractStatuses =
    | "ARRANGED"
    | "ASSIGNED"
    | "STARTED"
    | "FINISHED"
    | "PENDING";

// export type contractWorkerInfoType = {
// 	type: "Fachkraft/Träger" | "Monteur" | "LKW Fahrer 3,5t" | "LKW Fahrer ab 7,5t"
// 	hourly_wage: number
// 	coming_fee: number
// }[]

type workerInfoForContract = {
    hourly_wage: number;
    coming_fee: number;
    amount: number;
};
type carInfoForContract = {
    daily_wage: number;
    amount: number;
};
export type contractWorkersInfoType = {
    "Fachkraft/Träger": workerInfoForContract;
    Monteur: workerInfoForContract;
    "LKW Fahrer 3,5t": workerInfoForContract;
    "LKW Fahrer ab 7,5t": workerInfoForContract;
    Sonstiges: workerInfoForContract;
};
export type contractCarsInfoType = {
    "LKW 3,5t": carInfoForContract;
    "LKW 7,5t": carInfoForContract;
    "LKW 12t": carInfoForContract;
    "LKW 18t": carInfoForContract;
    "LKW 40t Sattelzug": carInfoForContract;
    Möbellift: carInfoForContract;
};
export interface IContract {
    id: number;
    firm: string;
    customer_name: string;
    date: string;
    status: contractStatuses;
    pdf_file: string | null;
    email: string;
    phone: string;
    price: number | null;
    start_address: string;
    end_address: string;
    cars_info: contractCarsInfoType;
    workers_info: contractWorkersInfoType;
    additional_documents: AdditionalDocumentType[];
    is_archived: boolean;
    start_time: string;
    end_time: string;
    sent_status: SentStatusType;
    sent_date?: string | null;
    paid_date?: string | null;
    paid_comment?: string;
}

export interface IEditContract
    extends Omit<
        IContract,
        "id" | "status" | "pdf_file" | "additional_documents" | "price"
    > {
    status?: contractStatuses;
}

export interface IEmployee extends IUser {}

export interface ICourier {
    employee: ISaleMan;
    id: string | number;
    sale_man: ISaleMan | null;
}

export interface ICar {
    id: string;
    model?: string;
    name?: string;
    number?: string;
    load_capacity?: string;
    type?: string;
    is_external: boolean;
    company?: number;
    company_name?: string;
}

export interface IAddCar
    extends Partial<Omit<ICar, "id" | "type" | "company">> {
    type: string;
    company_id: number;
}

export interface IEvent {
    id: number;
    name: string;
    description: string;
    date: string;
    start_time?: string | null;
    end_time?: string | null;
    image_path: string;
}
export type CreateEventType = Omit<IEvent, "id" | "image_path"> & {
    image: any;
};

export interface IBonus {
    id: number;
    bonuses: string;
    date: string;
}

export type TableStatisticsResponseType = AxiosResponse<{
    leads: {
        receive: number;
        open: number;
        converted_rate: number;
    };
    angebot: {
        sent: number;
        open: number;
        converted_rate: number;
    };
    converted_rate: number;
    bonuses: number;
    circulation: number;
}>;

export type TableInfoValueType = {
    label: string;
    value: string | number;
    goal?: { id: number; value: number };
    edit_name?: string;
};
export interface ITableStatistics {
    leadValues: TableInfoValueType[];
    offersValues: TableInfoValueType[];
    converted_rate: number;
    bonuses: number;
    circulation: number;
}

export type TableStatisticGoalsResponseType = {
    id: number;
    leads_converted_rate: number;
    leads_received: number;
    angebot_converted_rate: number;
    angebot_sent: number;
};
