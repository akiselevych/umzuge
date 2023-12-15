export enum webPagesEnum {
    "Home-page" = "Home-page",
    "Ueber-uns" = "Ueber-uns",
    "Unser-team" = "Unser-team",
    "Einlagerung" = "Einlagerung",
    "Privatumzug" = "Privatumzug",
    "Firmenumzug" = "Firmenumzug",
    "Stellenangebote" = "Stellenangebote",
    "Ein-und-Auspackservice" = "Ein-und-Auspackservice",
    "Mobelmontage" = "Mobelmontage",
    "Verpackungsmaterial" = "Verpackungsmaterial",
    "Entruempelung" = "Entruempelung",
    "Halteverbot" = "Halteverbot",
    "Endreinigung" = "Endreinigung",
    "Kontakt" = "Kontakt",
    "Ratgeber" = "Ratgeber",
    "Not-found" = "Not-found",
    "Beratung-anfordern" = "Beratung-anfordern",
    "Price-page" = "Price-page",
    "Besichtigungstermin-anfragen" = "Besichtigungstermin-anfragen",
    "Umzugscheckliste" = "Umzugscheckliste",
    "Dienstleistungsqualitat" = "Dienstleistungsqualitat",
    "AGB" = "AGB",
    "Datenschutz" = "Datenschutz",
    "Impressum" = "Impressum",
    "Bonnigheim" = "Bonnigheim",
    "Sersheim" = "Sersheim",
    "Besigheim" = "Besigheim",
    "Bietigheim-Bissingen" = "Bietigheim-Bissingen",
    "Freiberg-am-Neckar" = "Freiberg-am-Neckar",
    "Markgroeningen" = "Markgroeningen",
    "Moeglingen" = "Moeglingen",
    "Stuttgart" = "Stuttgart",
}
export enum webPagesLocalPages {
    "home page" = "home page",
    "bonnigheim" = "bonnigheim",
    "sersheim" = "sersheim",
    "umzugsunternehmen-besigheim" = "umzugsunternehmen-besigheim",
    "umzugsunternehmen-bietigheim-bissingen" = "umzugsunternehmen-bietigheim-bissingen",
    "umzugsunternehmen-freiberg-am-neckar" = "umzugsunternehmen-freiberg-am-neckar",
    "umzugsunternehmen-markgroeningen" = "umzugsunternehmen-markgroeningen",
    "umzugsunternehmen-moeglingen" = "umzugsunternehmen-moeglingen",
    "umzugsunternehmen-stuttgart" = "umzugsunternehmen-stuttgart",
}
export enum webPagesRepeatedBlocksEnum {
    "Footer" = "Footer",
    "Header" = "Header",
    "Error-banner" = "Error-banner",
    "Empty-list" = "Empty-list",
    "Calculator-form" = "Calculator-form",
    "Repeted-elements" = "Repeted-elements",
}
export enum webPagesTableType {
    Headlines = "Headlines",
    Content = "Content",
    Images = "Images",
    Meta = "Meta",
}

//STATIC CONTENT
export interface ImageType {
    id: number;
    image_name: string;
    format: string;
    weight: string;
    image: string;
    alt_text: string;
    web_page: number;
}

export interface UpadateImagesResponseType extends ImageType {
    pending_changes: boolean;
}

export type UpdateImagePayloadType = {
    id: number;
    data: FormData;
};

export interface IWebPage {
    id: number;
    images: ImageType[];
    page_name: webPagesEnum;
    heading_tags: {
        [key: string]: string;
    };
    meta_tags: {
        meta_title: string;
        meta_description: string;
    };
    content: {
        [key: string]: string;
    };
    is_repeated_component?: boolean;
}
export interface UpadateWebpageResponseType extends IWebPage {
    pending_changes: boolean;
}

export interface IUpdateWebPagePayload {
    id: number;
    data: {
        heading_tags?: Partial<IWebPage["heading_tags"]>;
        meta_tags?: Partial<IWebPage["meta_tags"]>;
        content?: Partial<IWebPage["content"]>;
    };
}

export interface ICityQueryParams extends IWebPage {
    page: number;
}
export interface ICityQueryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IWebPage[];
}
