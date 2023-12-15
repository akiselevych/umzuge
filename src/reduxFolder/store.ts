//Libs
import { combineReducers, configureStore } from "@reduxjs/toolkit"
// Slices
import Table from "reduxFolder/slices/Table.slice"
import User from "reduxFolder/slices/User.slice"
import Accounting from "reduxFolder/slices/Accounting.slice"
import Calendar from "reduxFolder/slices/Calendar.slice"
import orders from "reduxFolder/slices/ordersSlice"
import Leads from "reduxFolder/slices/Leads.slice"
import expenses from "reduxFolder/slices/expensesSlice"
import unexpectedExpenses from "reduxFolder/slices/unexpectedExpensesSlice"
import marketing from "reduxFolder/slices/marketingBlogSlice"
import marketingEmployees from "reduxFolder/slices/marketingEmployees.slice"
import marketingVacancies from "reduxFolder/slices/marketingVacancies.slice"
import marketingPhotoReviews from "reduxFolder/slices/marketingPhotoReviews.slice"
import marketingPartners from "reduxFolder/slices/marketingPartners.slice"
import marketingClientReviews from "reduxFolder/slices/marketingClientReviews.slice"
import marketingFAQ from "reduxFolder/slices/marketingFAQ.slice"
import marketingCities from "reduxFolder/slices/marketingCities.slice"
import marketingWebPage from "reduxFolder/slices/marketingWebPage.slice"

const rootReducer = combineReducers({
  Table,
  User,
  Calendar,
  Accounting,
  orders,
  expenses,
  unexpectedExpenses,
  Leads,
  marketing,
  marketingVacancies,
  marketingEmployees,
  marketingPhotoReviews,
  marketingPartners,
  marketingFAQ,
  marketingClientReviews,
  marketingCities,
  marketingWebPage,
})

export const store = configureStore({
  reducer: rootReducer,
})
