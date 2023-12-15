import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "types";

export const sortedOrdersSelector = createSelector(
  (state: RootStateType) => state.orders.orders,
  (orders) => {
    const copy = orders.slice();
    // console.log(copy)
    // return copy

    return copy.sort((a, b) => a.date.localeCompare(b.date));
  }
);

export const selectSortedUnexpectedExpenses = createSelector(
  (state: RootStateType) => state.unexpectedExpenses.unexpectedExpenses,
  (unexpectedExpenses) => {
    return [...unexpectedExpenses].sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  }
)
