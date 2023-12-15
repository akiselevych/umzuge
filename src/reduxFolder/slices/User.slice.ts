// Libs
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { API } from "services/API"
import { IUser, IMessage, WorkflowNameType } from "types/user"
import jwt_decode from "jwt-decode"
import { AppDispatch, RootStateType } from "types"

type InitialStateType = {
  user: IUser | null
  messages: IMessage[] | null
  isLoginLoading: boolean
  currentWorkflow: WorkflowNameType
}

const initialState: InitialStateType = {
  user: null,
  messages: null,
  isLoginLoading: false,
  currentWorkflow:
    (localStorage.getItem("currentWorkflow") as WorkflowNameType) || "Admin",
}

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (props: {
    userData: { username: string; password: string }
    dispatch: AppDispatch
  }) => {
    try {
      const response = await API.login(props.userData)
      localStorage.setItem("access", response.access)
      localStorage.setItem("refresh", response.refresh)
    } catch (error) {
      console.log(error)
    }
  }
)
export const getAuthUser = createAsyncThunk("user/getSingleUser", async () => {
  try {
    const accessToken = localStorage.getItem("access")
    if (accessToken) {
      const decoded = jwt_decode(accessToken) as any
      if (decoded.user_id) {
        const response = await API.getSingleUser(decoded.user_id)
        return response
      }
    }
  } catch (error) {
    console.log(error)
  }
})

export const getMessages = createAsyncThunk("user/getMessages", async () => {
  try {
    const response = await API.getMessages()
    return response.results
  } catch (error) {
    console.log(error)
  }
})
export const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (data: { message: string; to_user_id: string; from_user_id: string }) => {
    try {
      const response = await API.sendMessage(data)
      return response.results
    } catch (error) {
      console.log(error)
      throw error
    }
  }
)
export const markMessageAsRead = createAsyncThunk(
  "user/markMessageAsRead",
  async (id: number) => {
    try {
      await API.markMessageAsRead(id)
    } catch (error) {
      console.log(error)
    }
  }
)

export const User = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload
    },
    setCurrentWorkflow(state, action: PayloadAction<WorkflowNameType>) {
      state.currentWorkflow = action.payload
      localStorage.setItem("currentWorkflow", action.payload)
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoginLoading = true
    })
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isLoginLoading = false
    })
    builder.addCase(
      getMessages.fulfilled,
      (state, action: PayloadAction<IMessage[]>) => {
        const sortedMessages = action.payload.sort((a, b) => {
          const dateA = new Date(a.date_time).getTime()
          const dateB = new Date(b.date_time).getTime()
          return dateB - dateA
        })

        state.messages = sortedMessages
      }
    )
    builder.addCase(getAuthUser.pending, (state) => {
      state.isLoginLoading = true
    })
    builder.addCase(getAuthUser.rejected, (state) => {
      state.isLoginLoading = false
    })
    builder.addCase(getAuthUser.fulfilled, (state, action) => {
      state.user = action.payload ? action.payload : null
      state.isLoginLoading = false
    })
  },
})

export const {} = User.actions

export default User.reducer
