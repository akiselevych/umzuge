// Styles
import styles from "pages/Header/Header.module.scss"
// Icons, images
import searchIcon from "assets/icons/search.svg"
import xMarkIcon from "assets/icons/xmark.svg"
import bellIcon from "assets/icons/bell.badge.svg"
// Types
import { AppDispatch, RootStateType } from "types"
// Hooks
import { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import HeaderProfile from "components/HeaderProfile/HeaderProfile"
import ModalWindow from "components/ModalWindow/ModalWindow"
import Complaints from "components/Complaints/Complaints"
import ToggleState from "components/ToggleState/ToggleState"
import { useActions } from "hooks/useActions"
import { tablesNamesDict } from "components/TablesList/TablesList"
import { useDebounce } from "hooks/useDebounce"
import {
  getSearchLeads,
  getSearchOffers,
  getSearchOrders,
} from "reduxFolder/slices/Table.slice"
import logo from "assets/images/Logo.svg"
import { CurrentScreenType } from "types/calendar"

export const dispositionScreensNamesDict: Record<CurrentScreenType, string> = {
  Calendar: "Kalender",
  "Internal workers": "Interne Mitarbeiter",
  Suppliers: "Lieferanten Verzeichnis",
}

const Header: FC = () => {
  const currentTableName = useSelector(
    (state: RootStateType) => state.Table.currentTableName
  )
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )
  const currentDispositionScreen = useSelector(
    (state: RootStateType) => state.Calendar.currentScreen
  )
  const [isComplaintsOpen, setIsComplaintsOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    if (currentTableName === "Offers") {
      dispatch(getSearchOffers(debouncedSearch))
    } else if (currentTableName === "Orders") {
      dispatch(getSearchOrders(debouncedSearch))
    } else if (currentTableName === "Leads") {
      dispatch(getSearchLeads(debouncedSearch))
    }
  }, [debouncedSearch])

  useEffect(() => {
    setSearch("")
  }, [currentTableName])

  let displayHeaderLeftPart = <h1 className={styles.title}>{currentTableName}</h1>
  let displayHeaderRightPart = <Search search={search} setSearch={setSearch} />

  const currentOption = useSelector(
    (state: RootStateType) => state.Calendar.calendarItem
  )
  const { setCalendarItem } = useActions()
  switch (currentWorkflow) {
    case "Admin": {
      displayHeaderLeftPart = (
        <h1 className={styles.title}>
          {tablesNamesDict[currentTableName as keyof typeof tablesNamesDict]}
        </h1>
      )
      displayHeaderRightPart = <Search search={search} setSearch={setSearch} />
      break
    }
    case "SaleMan": {
      displayHeaderLeftPart = (
        <h1 className={styles.title}>
          {tablesNamesDict[currentTableName as keyof typeof tablesNamesDict]}
        </h1>
      )
      displayHeaderRightPart = <Search search={search} setSearch={setSearch} />
      break
    }
    case "Disposition": {
      {
        currentDispositionScreen === "Calendar"
          ? (displayHeaderLeftPart = (
              <ToggleState
                options={["Angebote", "Mitarbeiter"]}
                currentOption={currentOption}
                onToggle={setCalendarItem}
              />
            ))
          : (displayHeaderLeftPart = (
              <h1 className={styles.title}>
                {dispositionScreensNamesDict[currentDispositionScreen]}
              </h1>
            ))
      }
      displayHeaderRightPart = <></>
      break
    }
    case "Marketing": {
      displayHeaderLeftPart = <img src={logo} alt="logo" style={{ height: 52 }} />
    }
    case "Accounting": {
      displayHeaderLeftPart = <img src={logo} alt="logo" style={{ height: 52 }} />
    }

    default:
      displayHeaderRightPart = <></>
      break
  }

  return (
    <>
      <header className={styles.header}>
        {displayHeaderLeftPart}
        <div className={styles.content}>
          {displayHeaderRightPart}

          {currentWorkflow !== "Marketing" && (
            <button
              onClick={() => setIsComplaintsOpen(true)}
              className={styles.complaints}
            >
              <img src={bellIcon} alt="notifications" />
            </button>
          )}

          <HeaderProfile />
        </div>
      </header>

      <ModalWindow
        size="large"
        withLogo={true}
        isModaltOpen={isComplaintsOpen}
        setIsModaltOpen={setIsComplaintsOpen}
      >
        <Complaints />
      </ModalWindow>
    </>
  )
}

export default Header

const Search: FC<{ search: string; setSearch: (value: string) => void }> = ({
  search,
  setSearch,
}) => (
  <div className={styles.search}>
    <img src={searchIcon} alt="searchIcon" className={styles.searchIcon} />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      type="text"
      placeholder="Suchen"
    />
    <img
      src={xMarkIcon}
      onClick={() => setSearch("")}
      className={styles.microphoneIcon}
      style={search.length === 0 ? { display: "none" } : { display: "block" }}
      alt="microphoneIcon"
    />
  </div>
)
