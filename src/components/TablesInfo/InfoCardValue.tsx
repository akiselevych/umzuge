import { FC, useState } from "react"
import styles from "components/TablesInfo/TablesInfo.module.scss"
import classNames from "classnames"
import pencilIcon from "assets/icons/pencil.svg"
import checkmarkIcon from "assets/icons/check-mark.svg"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import { TableInfoValueType, TableStatisticGoalsResponseType } from "types/tables"
import { API } from "services/API"
import { useSelector } from "react-redux"
import { RootStateType } from "types/index"

type PropsType = {
  item: TableInfoValueType
  values: TableInfoValueType[]
}

const InfoCardValue: FC<PropsType> = ({ values, item }) => {
  const user = useSelector((state: RootStateType) => state.User.user)
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )

  const [isEditing, setIsEditing] = useState(false)
  const [goal, setGoal] = useState(item.goal?.value)

  async function handleEdit() {
    if (!item.goal?.id) return
    const newGoal: Partial<Omit<TableStatisticGoalsResponseType, "id">> = {
      [String(item.edit_name)]: goal,
    }
    const response = await API.editTargetForTableStatistics(item.goal.id, newGoal)
    if (response.statusText === "OK") {
      setIsEditing(false)
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <div
      className={styles.block}
      style={
        values.length % 2 !== 0 &&
        item.label === values[values.length - 1]?.label &&
        window.innerWidth > 1300
          ? { gridColumn: "span 2" }
          : {}
      }
    >
      <div className={styles.value}>
        {item.value ?? "-"} {item.label ?? "-"}
      </div>
      {item.goal !== undefined && item.goal !== null && (
        <div className={classNames(styles.flex, styles.goal)}>
          <div className={styles.flex}>
            Ziel:{" "}
            {isEditing ? (
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                onKeyDown={handleNumberInputChange}
                style={{ width: 50 }}
              />
            ) : (
              goal
            )}
          </div>

          {user?.role === "admin" &&
            currentWorkflow === "Admin" &&
            (isEditing ? (
              <button onClick={handleEdit}>
                <img
                  src={checkmarkIcon}
                  alt="confirm"
                  style={{ width: 16, height: 16 }}
                />
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <img src={pencilIcon} alt="edit" />
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default InfoCardValue
