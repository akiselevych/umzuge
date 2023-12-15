import { FC, useEffect, useState } from "react"
// Styles
import styles from "./App.module.scss"
// Components
import Header from "pages/Header/Header"
import Sidebar from "pages/Sidebar/Sidebar"
import AdminWorkflow from "pages/AdminWorkflow/AdminWorkflow"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootStateType } from "types"
import { getAuthUser } from "reduxFolder/slices/User.slice"
import { useNavigate } from "react-router-dom"
import DispositionWorkflow from "pages/DispositionWorkflow/DispositionWorkflow"
import LoadingPage from "pages/LoadingPage/LoadingPage"
import { useActions } from "hooks/useActions"
import { TableNameType } from "types/tables"
import MarketingWorkflow from "pages/MarketingWorkflow/MarketingWorkflow"
import AccountingWorkflow from "pages/AccountingWorkflow/AccountingWorkflow"

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((state: RootStateType) => state.User.user)
  const isLoading = useSelector((state: RootStateType) => state.User.isLoginLoading)
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )

  const { setCurrentTableName } = useActions()

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (user) {
      setIsInitialized(true)
    } else {
      dispatch(getAuthUser())
      if (!localStorage.getItem("access")) navigate("/login")
    }
  }, [user])

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setCurrentTableName(
          (localStorage.getItem("currentTable") as TableNameType) || "Employees"
        )
      } else {
        setCurrentTableName(
          (localStorage.getItem("currentTable") as TableNameType) || "Leads"
        )
      }
    }
  }, [user])

  if (isLoading) return <LoadingPage />

  if (!isInitialized) return <div>Something went wrong...</div>

  let dispayWorkflow = null

  switch (user?.role) {
    case "admin": {
      switch (currentWorkflow) {
        case "Admin": {
          dispayWorkflow = <AdminWorkflow />
          break
        }
        case "Disposition": {
          dispayWorkflow = <DispositionWorkflow />
          break
        }
        case "SaleMan": {
          dispayWorkflow = <AdminWorkflow />
          break
        }
        case "Marketing": {
          dispayWorkflow = <MarketingWorkflow />
          break
        }
        case "Accounting": {
          dispayWorkflow = <AccountingWorkflow />
          break
        }

        default:
          dispayWorkflow = <div>404</div>
          break
      }
      break
    }
    case "disposition": {
      dispayWorkflow = <DispositionWorkflow />
      break
    }
    case "sale_man": {
      dispayWorkflow = <AdminWorkflow />
      break
    }
    case "courier": {
      dispayWorkflow = <div>Courier</div>
      break
    }

    default: {
      dispayWorkflow = <div>No needed role</div>
      break
    }
  }

  return (
    <div className={styles.app} id="app">
      {currentWorkflow !== "Marketing" && currentWorkflow !== "Accounting" && (
        <Sidebar />
      )}
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>{dispayWorkflow}</main>
      </div>
    </div>
  )
}

export default App
