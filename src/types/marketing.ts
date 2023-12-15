import { webPagesLocalPages } from "components/Marketing/Website/types";

export interface IPost {
    id: number;
    title: string;
    short_description: string;
    category: "Unkategorisiert" | "Umzüge";
    primary_image: File | undefined;
    date_posted: string;
    meta_title: string;
    meta_description: string;
    comment_count: number;
}

export interface IBlock {
    id: number;
    block_type: string;
    block_title: string;
    content: string;
    image: File | IStrFile | undefined;
    image_type: "horizontal" | "vertical";
    post: number;
}

export interface IStrFile {
    name: string;
    type: string;
    url: string;
}
//VACANCY
export interface IVacancy {
    job_title: string;
    city: string;
    gender: string;
    tasks: string;
    profile: string;
    we_offer: string;
    meta_title: string;
    meta_description: string;
    slug: string;
    employment_type: "office" | "remote" | "hybrid";
    date: string;
    id: number;
    order: number;
}
export interface ICreateVacancyPayload {
    job_title: string;
    city: string;
    gender: string;
    tasks: string;
    profile: string;
    we_offer: string;
    meta_title: string;
    meta_description: string;
    employment_type: "office" | "remote" | "hybrid";
    id: number;
}
export interface IVacancyQueryParams extends IVacancy {
    page: number;
}
export interface IVacancyQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IVacancy[];
}
//EMPLOYEES
export interface IEmployee {
    id: number;
    image: string;
    position: string;
    name: string;
    order: number;
    image_name: string;
}
export type ICreateEmployeePayload = FormData;
export type IUpdateEmployeePayload = {
    id: number;
    data: FormData;
};
export interface IEmployeeQueryParams extends IVacancy {
    page: number;
}
export interface IEmployeeQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IVacancy[];
}
//PHOTOREWIEWS
export interface IPhotoReview {
    id: number;
    image: string;
    image_name: string;
    order: number;
}
export type ICreatePhotoReviewPayload = FormData;
export type IUpdatePhotoReviewPayload = {
    id: number;
    data: FormData;
};

export interface IPhotoReviewQueryParams extends IVacancy {
    page: number;
}
export interface IPhotoReviewQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IPhotoReview[];
}
//PARTNERS
export interface IPartner {
    id: number;
    image: string;
    image_name: string;
    order: number;
}
export type ICreatePartnerPayload = FormData;
export type IUpdatePartnerPayload = {
    id: number;
    data: FormData;
};

export interface IPartnerQueryParams extends IVacancy {
    page: number;
}
export interface IPartnerQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IPartner[];
}
//Customer-Reviews
export interface ICustomerReview {
    id: number;
    reviewer_name: string;
    review_text: string;
    order: number;
    rating: number;
    page_name: webPagesLocalPages;
}
export type ICreateCustomerReviewPayload = {
    reviewer_name: string;
    review_text: string;
    rating: number;
    page_name: webPagesLocalPages;
};
export type IUpdateCustomerReviewPayload = {
    id: number;
    data: {
        reviewer_name: string;
        review_text: string;
        rating: number;
        page_name: webPagesLocalPages;
    };
};

export interface ICustomerReviewQueryParams extends IVacancy {
    page: number;
}
export interface ICustomerReviewQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICustomerReview[];
}

//FAQ

export interface IFaq {
    id: number;
    question: string;
    answer: string;
    order: number;
    page_name: webPagesLocalPages;
}
export type ICreateFaqPayload = {
    question: string;
    answer: string;
    page_name: webPagesLocalPages;
};
export type IUpdateFaqPayload = {
    id: number;
    data: {
        question: string;
        answer: string;
    };
};

export interface IFaqQueryParams extends IVacancy {
    page: number;
}
export interface IFaqQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICustomerReview[];
}

//Cities
export interface ICity {
    id: number;
    relocation_type: "regional" | "interregional";
    order: number;
    city_name: string;
}
export type ICreateCityPayload = {
    relocation_type: "regional" | "interregional";
    city_name: string;
};
export type IUpdateCityPayload = {
    id: number;
    data: {
        relocation_type: "regional" | "interregional";
        city_name: string;
    };
};

export interface ICityQueryParams extends IVacancy {
    page: number;
}
export interface ICityQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICity[];
}
