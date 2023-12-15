// Libs
import { bindActionCreators } from "@reduxjs/toolkit"
// Hooks
import { useMemo } from "react"
import { useDispatch } from "react-redux"
// Components
import { Table } from "reduxFolder/slices/Table.slice"
import { User } from "reduxFolder/slices/User.slice"
import { Calendar } from "reduxFolder/slices/Calendar.slice"
import { Accounting } from "reduxFolder/slices/Accounting.slice"

const rootActions = {
  ...Table.actions,
  ...User.actions,
  ...Calendar.actions,
  ...Accounting.actions,
}

export const useActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => {
    return bindActionCreators(rootActions, dispatch)
  }, [dispatch])
}
