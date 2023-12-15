import moment from "moment";
import { useHttp } from "hooks/useHttp";
import { instance, serverDomain } from "services/API";
import {
  IAddTask,
  IAddVacation,
  IEditVacation,
  IInternalCourier,
  IInternalSaleMan,
  IMeetingAddBody,
  IMeetingAddResponse,
  IMeetingBook,
  IMeetingEditBody,
  IMeetingsResponse,
  IVacation,
} from "./../../types/calendar";
import { IEmployee } from "./../../types/tables";
// Libs
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API } from "services/API";
import {
  CalendarItemType,
  CurrentScreenType,
  CalendarViewModeType,
  IExternalWorker,
  ITask,
  IMeetingBookResponse,
} from "types/calendar";

type InitialStateType = {
  meetingCalendarDay: string; // YYYY-MM-DD format
  meetingCalendarType: "online" | "offline";
  meetingCalendarEvent: "EventTypes" | "Scheduled" | "Create";
  calendarItem: CalendarItemType;
  calendarViewMode: CalendarViewModeType;
  currentDate: string;
  tasks: ITask[] | null;
  currentScreen: CurrentScreenType;
  internalCurrentWorkerType: "Technische Mitarbeiter" | "Verkäufer";
  externalWorkers: IExternalWorker[] | null;
  internalWorkers: {
    sale_mans: IInternalSaleMan[] | null;
    couriers: IInternalCourier[] | null;
  };
  meetingBooking: IMeetingBook[] | null;
  meetings: IMeetingsResponse | null;
  tasksForCouriers: ITask[] | null;
  currentlyOpenedSaleManId: string | null;
  currentlyOpenedSaleMan: IEmployee | null;
  vacations: IVacation[] | null;
  vacationDataForWorkersTable: { [key: string]: string } | null;
  vacationDataForWorkersTableLoadingStatus: "loading" | "idle" | "error";
  vacationOfSpecialWorker: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          total_days: string;
          duration: { start_date: number; end_date: number }[];
        };
      };
    };
  } | null;
  vacationOfSpecialWorkerLoadingStatus: "loading" | "idle" | "error";
};

const initialState: InitialStateType = {
  meetingCalendarDay: moment().format("YYYY-MM-DD"),
  meetingCalendarType: "online",
  meetingCalendarEvent: "EventTypes",
  calendarItem:
    (localStorage.getItem("calendarItem") as CalendarItemType) || "Angebote",
  calendarViewMode:
    (localStorage.getItem("calendarViewMode") as CalendarViewModeType) || "Tag",
  currentDate:
    localStorage.getItem("currentDate") || moment().format("YYYY-MM-DD"),
  tasks: null,
  currentScreen:
    (localStorage.getItem("currentDispositionScreen") as CurrentScreenType) ||
    "Calendar",
  internalCurrentWorkerType:
    (localStorage.getItem("internalCurrentWorkerType") as
      | "Technische Mitarbeiter"
      | "Verkäufer") || "Technische Mitarbeiter",
  externalWorkers: null,
  internalWorkers: {
    couriers: null,
    sale_mans: null,
  },
  tasksForCouriers: null,
  currentlyOpenedSaleManId: null,
  currentlyOpenedSaleMan: null,
  vacations: null,
  meetingBooking: null,
  meetings: null,
  vacationDataForWorkersTableLoadingStatus: "loading",
  vacationOfSpecialWorkerLoadingStatus: "loading",
  vacationDataForWorkersTable: null,
  vacationOfSpecialWorker: null,
};

// Tasks
export const getTasks = createAsyncThunk(
  "calendar/getTasks",
  async (filters?: string | undefined) => {
    try {
      const data = await API.getTasks(filters);
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getTasksForCourier = createAsyncThunk(
  "calendar/getTasksForCourier",
  async (ids: string) => {
    try {
      const data = await API.getTasksForCourier(ids);
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editTask = createAsyncThunk(
  "table/editTask",
  async (props: { id: number; data: any }) => {
    try {
      const response = await API.editTask(props.id, props.data);
      return { id: props.id, data: response };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const addTask = createAsyncThunk(
  "table/addTask",
  async (data: IAddTask) => {
    try {
      await API.addTask(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const deleteTask = createAsyncThunk(
  "table/deleteTask",
  async (id: number) => {
    try {
      await API.deleteTask(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Employee
export const getEmployeeById = createAsyncThunk(
  "calendar/getEmployeeById",
  async (id: string) => {
    try {
      const data = await API.getEmployeeById(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Vacations
export const getVacations = createAsyncThunk(
  "calendar/getVacations",
  async () => {
    try {
      const data = await API.getVacations();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editVacaion = createAsyncThunk(
  "calendar/editVacaion",
  async (props: { id: number; data: Partial<IEditVacation> }) => {
    try {
      const response = await API.editVacation(props.id, props.data);
      return { id: props.id, data: response };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const addVacation = createAsyncThunk(
  "calendar/addVacation",
  async (data: IAddVacation) => {
    try {
      await API.addVacation(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const getVacationDataForWorkersTable = createAsyncThunk(
  "expenses/getVacationDataForWorkersTable",
  (payload: { end_date: string; start_date: string }) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/vacations/statistics/?start_date=${payload.start_date}&end_date=${payload.end_date}`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);
export const getVacationOfSpecialWorker = createAsyncThunk(
  "expenses/getVacationOfSpecialWorker",
  (payload: { end_date: string; start_date: string; id: string | number }) => {
    const { request } = useHttp();
    return request(
      `${serverDomain}api/v1/vacations/statistics/?employee_id=${payload.id}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

// External workers
export const getExternalWorkers = createAsyncThunk(
  "calendar/getExternalWorkers",
  async () => {
    try {
      const data = await API.getExternalWorkers();
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getExternalWorkersForCompany = createAsyncThunk(
  "calendar/getExternalWorkersForCompany",
  async (companyId: number) => {
    try {
      const data = await API.getExternalWorkers(companyId);
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editExternalWorker = createAsyncThunk(
  "calendar/addExternalWorker",
  async (data: Partial<IExternalWorker>) => {
    if (!data) return;
    try {
      const response = await API.editExternalWorker(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const addExternalWorker = createAsyncThunk(
  "calendar/addExternalWorker",
  async (data: Omit<IExternalWorker, "id">) => {
    try {
      const response = await API.addExternalWorker(data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Meetings
export const getMeetingsBooking = createAsyncThunk(
  "calendar/getMeetingsBooking",
  async ({
    type,
    date,
    date_range_after,
    date_range_before,
  }: {
    type: "all" | "offline" | "online";
    date?: string;
    date_range_after?: string;
    date_range_before?: string;
  }) => {
    const data = await API.getMeetingsBooking({
      type,
      date,
      date_range_after,
      date_range_before,
    });

    const allMeetings: IMeetingBook[] = [];
    allMeetings.push(...data.results);

    while (data.next) {
      const { data: nextPageResponse } = await instance.get(
        data.next.replace("http", "https")
      );

      allMeetings.push(...nextPageResponse.results);

      return allMeetings;
    }

    return allMeetings;
  }
);

export const cancelBookMeeting = createAsyncThunk(
  "calendar/cancelMeeting",
  async (id: number) => {
    try {
      const response = await API.cancelBookMeeting(id);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const getMeetings = createAsyncThunk(
  "calendar/getMeetings",
  async ({
    date,
    type,
  }: {
    date?: string;
    type: "online" | "offline" | "all";
  }) => {
    const data = await API.getMeetings({ date, type });
    return data as IMeetingsResponse;
  }
);

export const addMeeting = createAsyncThunk(
  "calendar/addMeeting",
  async (data: IMeetingAddBody) => {
    try {
      const response = await API.addMeeting(data);

      return response as IMeetingAddResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const editMeeting = createAsyncThunk(
  "calendar/editMeeting",
  async (data: IMeetingEditBody) => {
    try {
      const response = await API.editMeeting(data);

      return response as IMeetingAddResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Disposition workerss
export const getDispositionlWorkers = createAsyncThunk(
  "calendar/getInternalWorkers",
  async (props: {
    role: "external_worker" | "sale_man" | "courier";
    start_date: string;
    end_date: string;
    company_id?: number | undefined;
  }) => {
    try {
      const data = await API.getEmployeesStatistics(
        props.role,
        props.start_date,
        props.end_date,
        props.company_id
      );
      return { data: data, role: props.role };
    } catch (error) {
      console.log(error);
    }
  }
);
export const getExternalWorkersInfoForCompany = createAsyncThunk(
  "calendar/getExternalWorkersForCompany",
  async (props: {
    start_date: string;
    end_date: string;
    company_id?: number | undefined;
  }) => {
    try {
      const data = await API.getEmployeesStatistics(
        "external_worker",
        props.start_date,
        props.end_date,
        props.company_id
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const Calendar = createSlice({
  name: "Calendar",
  initialState,
  reducers: {
    setMeetingCalendarDay(state, action: PayloadAction<string>) {
      state.meetingCalendarDay = action.payload;
    },
    setMeetingCalendarType(state, action: PayloadAction<"online" | "offline">) {
      state.meetingCalendarType = action.payload;
    },
    setMeetingCalendarEvent(
      state,
      action: PayloadAction<"EventTypes" | "Scheduled" | "Create">
    ) {
      state.meetingCalendarEvent = action.payload;
    },
    setCurrentDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
      localStorage.setItem("currentDate", action.payload);
    },
    setCurrentlyOpenedSaleManId(state, action: PayloadAction<string | null>) {
      state.currentlyOpenedSaleManId = action.payload;
    },
    setCurrentlyOpenedSaleMan(state, action: PayloadAction<IEmployee | null>) {
      state.currentlyOpenedSaleMan = action.payload;
    },
    setCurrentDispositionScreen(
      state,
      action: PayloadAction<CurrentScreenType>
    ) {
      state.currentScreen = action.payload;
      localStorage.setItem("currentDispositionScreen", action.payload);
    },
    setCalendarItem(state, action: PayloadAction<CalendarItemType>) {
      state.calendarItem = action.payload;
      state.currentDate = moment().format("YYYY-MM-DD");
      localStorage.setItem("calendarItem", action.payload);
    },
    setCalendarViewMode(state, action: PayloadAction<CalendarViewModeType>) {
      state.calendarViewMode = action.payload;
      localStorage.setItem("calendarViewMode", action.payload);
    },
    setInternalCurrentWorkerType(
      state,
      action: PayloadAction<"Technische Mitarbeiter" | "Verkäufer">
    ) {
      state.internalCurrentWorkerType = action.payload;
      localStorage.setItem("internalCurrentWorkerType", action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getTasks.fulfilled,
      (state, action: PayloadAction<ITask[]>) => {
        state.tasks = action.payload;
      }
    );
    // Vacations
    builder.addCase(
      getVacations.fulfilled,
      (state, action: PayloadAction<IVacation[]>) => {
        state.vacations = action.payload;
      }
    );
    builder
      .addCase(editVacaion.fulfilled, (state, action) => {
        const vacationIndex = state.vacations?.findIndex(
          (v) => v.id === action.payload.id
        );
        if (vacationIndex !== undefined && state.vacations) {
          state.vacations[vacationIndex] = {
            ...state.vacations[vacationIndex],
            ...action.payload.data,
          };
        }
      })
      .addCase(getVacationDataForWorkersTable.pending, (state) => {
        state.vacationDataForWorkersTableLoadingStatus = "loading";
      })
      .addCase(
        getVacationDataForWorkersTable.fulfilled,
        (state, { payload }) => {
          state.vacationDataForWorkersTable = payload;
          state.vacationDataForWorkersTableLoadingStatus = "idle";
        }
      )
      .addCase(getVacationDataForWorkersTable.rejected, (state) => {
        state.vacationDataForWorkersTableLoadingStatus = "error";
      })
      .addCase(getVacationOfSpecialWorker.pending, (state) => {
        state.vacationOfSpecialWorkerLoadingStatus = "loading";
      })
      .addCase(getVacationOfSpecialWorker.fulfilled, (state, { payload }) => {
        state.vacationOfSpecialWorker = payload;
        state.vacationOfSpecialWorkerLoadingStatus = "idle";
      })
      .addCase(getVacationOfSpecialWorker.rejected, (state) => {
        state.vacationOfSpecialWorkerLoadingStatus = "error";
      });

    builder.addCase(
      getTasksForCourier.fulfilled,
      (state, action: PayloadAction<ITask[]>) => {
        state.tasksForCouriers = action.payload;
      }
    );
    builder.addCase(
      getExternalWorkers.fulfilled,
      (state, action: PayloadAction<IExternalWorker[]>) => {
        state.externalWorkers = action.payload;
      }
    );
    builder.addCase(
      editExternalWorker.fulfilled,
      (state, action: PayloadAction<IExternalWorker>) => {
        if (!state.externalWorkers) return;
        const worker = state.externalWorkers.findIndex(
          (w) => w.id === action.payload.id
        );
        if (worker !== undefined) {
          state.externalWorkers[worker] = {
            ...state.externalWorkers[worker],
            ...action.payload,
          };
        }
      }
    );
    builder.addCase(
      getDispositionlWorkers.fulfilled,
      (
        state,
        action: PayloadAction<
          | { data: any; role: "courier" | "sale_man" }
          | { data: any; role: "external_worker" }
          | undefined
        >
      ) => {
        const workers = Object.values(action.payload?.data);

        if (action.payload?.role === "external_worker") {
          state.externalWorkers = workers as any;
        } else if (action.payload?.role === "courier") {
          state.internalWorkers.couriers = workers as any;
        } else if (action.payload?.role === "sale_man") {
          state.internalWorkers.sale_mans = workers as any;
        }
      }
    );
    builder.addCase(
      getEmployeeById.fulfilled,
      (state, action: PayloadAction<IEmployee | null>) => {
        state.currentlyOpenedSaleMan = action.payload;
      }
    );
    builder.addCase(editTask.fulfilled, (state, action) => {
      if (!state.tasks) return;
      const task = state.tasks.findIndex((t) => +t.id === action.payload?.id);
      if (task !== undefined) {
        state.tasks[task] = {
          ...state.tasks[task],
          ...action.payload?.data,
        };
      }
    });
    // Meetings
    builder.addCase(
      getMeetingsBooking.fulfilled,
      (state, action: PayloadAction<IMeetingBook[]>) => {
        state.meetingBooking = action.payload;
      }
    );
    builder.addCase(
      getMeetings.fulfilled,
      (state, action: PayloadAction<IMeetingsResponse>) => {
        state.meetings = action.payload;
      }
    );
  },
});

export default Calendar.reducer;
