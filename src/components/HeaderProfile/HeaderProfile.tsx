import { FC, useEffect, useRef, useState } from "react"
import classNames from "classnames"

import defaultPhoto from "assets/images/person.svg"
import exitIcon from "assets/icons/exit.svg"
import arrowIcon from "assets/icons/arrow.svg"

import styles from "./HeaderProfile.module.scss"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { serverDomain } from "services/API"
import { useActions } from "hooks/useActions"
import { WorkflowNameType } from "types/user"
import { TableNameType } from "types/tables"
import { useNavigate } from "react-router-dom"

const HeaderProfile: FC = () => {
  const user = useSelector((state: RootStateType) => state.User.user)
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )
  const { setUser, setCurrentWorkflow, setCurrentTableName } = useActions()

  const [isLogOutVisible, setIsLogOutVisible] = useState(false)

  const navigate = useNavigate()
  const openDropDownRef = useRef(null)
  const DropDownRef = useRef(null)

  const workflowButtonsNames: Record<WorkflowNameType, string> = {
    Admin: "Admin",
    SaleMan: "Verkäufer",
    Disposition: "Disposition",
    Marketing: "Marketing",
    Accounting: "Buchhaltung",
  }

  const WorkflowButtons = Object.keys(workflowButtonsNames).map((n, i) => (
    <button
      key={i}
      onClick={() => {
        if (n === "Employee") setCurrentTableName("Leads")
        else
          setCurrentTableName(
            (localStorage.getItem("currentTable") as TableNameType) || "Employees"
          )
        setCurrentWorkflow(n as WorkflowNameType)
      }}
      className={currentWorkflow === n ? styles.current : ""}
    >
      {workflowButtonsNames[n as keyof typeof workflowButtonsNames]}
    </button>
  ))

  useEffect(() => {
    function handleClick(e: any) {
      if (
        e.target.closest("div") !== DropDownRef.current &&
        e.target.closest("button") !== openDropDownRef.current
      ) {
        setIsLogOutVisible(false)
      }
    }
    if (isLogOutVisible) window.addEventListener("click", handleClick)

    return () => window.removeEventListener("click", handleClick)
  }, [isLogOutVisible])

  function handleLogOut() {
    localStorage.clear()
    setUser(null)
    location.reload()
    navigate("/login")
  }

  return (
    <div className={styles.profile}>
      <img
        src={user?.image_path ? `${serverDomain}${user?.image_path}` : defaultPhoto}
        alt="avatar"
        className={styles.avatar}
      />
      <div className={styles.info}>
        <h2>
          {user?.first_name} {user?.last_name}
        </h2>
        <div className={styles.otherInfo}>
          {user?.role}
          <button
            onClick={() => setIsLogOutVisible(!isLogOutVisible)}
            ref={openDropDownRef}
          >
            <img
              src={arrowIcon}
              alt="arrow"
              className={
                isLogOutVisible
                  ? classNames(styles.arrowIcon, styles.active)
                  : styles.arrowIcon
              }
            />
          </button>
        </div>
      </div>

      <div
        className={classNames(styles.dropDown, isLogOutVisible && styles.visible)}
        ref={DropDownRef}
      >
        {user?.role === "admin" && (
          <div className={styles.workFlow}>{WorkflowButtons}</div>
        )}
        <button onClick={handleLogOut}>
          <img src={exitIcon} alt="logout" />
          Abmelden
        </button>
      </div>
    </div>
  )
}

export default HeaderProfile
