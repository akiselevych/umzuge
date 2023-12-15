export type LeadPlanningFieldsType = {
  dayCount: number
  currentDay: number
  currentField: string
  days_info: DayPlanningItemType[]
  newFieldData: FieldType
}

export type DayPlanningItemType = {
  date: string
  loading_address: LoadingAddressFieldsType
  unloading_address: UnloadingAddressFieldsType
}

export type LoadingAddressFieldsType = {
  loading: FieldType
  disassembly: FieldType
  packing: FieldType
  packing_service: FieldType
  additional_service: FieldType
  transportation: FieldType
}
export type UnloadingAddressFieldsType = {
  unloading: FieldType
  assembly: FieldType
  unpacking_service: FieldType
  additional_service: FieldType
}

export type FieldType = {
  addition: string
  number_of_helpers: string
  start_time: string
  end_time: string
  total_time: string
}

export type BothAddressFieldKeys = keyof LoadingAddressFieldsType | keyof UnloadingAddressFieldsType

export const leadPlanningGroupsDict: Record<keyof Omit<DayPlanningItemType, "date">, string> = {
  loading_address: "Beladeadresse",
  unloading_address: "Entladeadresse",
}
export const leadPlanningFieldsDict: Record<BothAddressFieldKeys, string> = {
  loading: "Beladen",
  disassembly: "Demontage",
  packing: "Emballage",
  packing_service: "Einpackservice",
  additional_service: "Zusatzleistung",
  transportation: "Transport",
  unloading: "Entladen",
  assembly: "Montage",
  unpacking_service: "Auspackservice",
}
export const leadPlanningFieldValuesDict: Record<keyof FieldType, string> = {
  addition: "Zusatz",
  number_of_helpers: "Anz. Helfer",
  start_time: "Startzeit",
  end_time: "Endzeit",
  total_time: "Gesamtzeit",
}

export const initialDayValues: DayPlanningItemType = {
  date: "",
  loading_address: {
    loading: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    disassembly: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    packing: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    packing_service: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    additional_service: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    transportation: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
  },
  unloading_address: {
    unloading: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    assembly: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    unpacking_service: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
    additional_service: {
      addition: "",
      number_of_helpers: "",
      start_time: "",
      end_time: "",
      total_time: "",
    },
  },
}

export const defaultLeadPlanningValues: LeadPlanningFieldsType = {
  dayCount: 1,
  currentDay: 1,
  currentField: "loading_address.loading",
  days_info: [initialDayValues],
  newFieldData: {
    addition: "",
    number_of_helpers: "",
    start_time: "",
    end_time: "",
    total_time: "",
  },
}

export const dayInfoHeaders = ["Art", "Zusatz", "Anz. Helfer", "Startzeit", "Endzeit", "Tage"]

export const leadPlanningFieldsOptions: {
  loading_address: (keyof LoadingAddressFieldsType)[]
  unloading_address: (keyof UnloadingAddressFieldsType)[]
} = {
  loading_address: [
    "loading",
    "disassembly",
    "packing",
    "packing_service",
    "additional_service",
    "transportation",
  ],
  unloading_address: ["unloading", "assembly", "unpacking_service", "additional_service"],
}
