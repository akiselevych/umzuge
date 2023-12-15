import { FC, MouseEvent, useRef, useState } from "react"
import chatIcon from "assets/icons/chat.svg"
import defaultPhoto from "assets/images/person.svg"
import { IEmployee } from "types/tables"
import styles from "../Tables.module.scss"
import Switch from "components/Switch/Switch"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { handleToggleIsActive } from "utils/handleToggleIsActive"
import ModalWindow from "components/ModalWindow/ModalWindow"
import SendMessage from "components/Complaints/SendMessage/SendMessage"
import { serverDomain } from "services/API"
import ellipseIcon from "assets/icons/addEvent/Ellipse.svg"
import plusIcon from "assets/icons/addEvent/plus.svg"
import { RolesDict } from "components/TableFilters/EmployeesTableFilters"

type PropsType = {
  emp?: IEmployee
  isMapping: boolean
  isAdding?: boolean
  isEditing?: boolean
  setCurrentlyOpenedId?: (currentId: string) => void
  setIsModalOpen?: (isOpen: boolean) => void
  register?: any
  watchFields?: any
  setValue?: any
  setIsNotifivationVisible: (value: boolean) => void
}

const EmployeeCell: FC<PropsType> = ({
  setCurrentlyOpenedId,
  setIsModalOpen,
  emp,
  isAdding,
  isEditing,
  isMapping,
  register,
  setValue,
  watchFields,
  setIsNotifivationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const chatRef = useRef(null)
  const labelRef = useRef(null)
  const checkboxRef = useRef(null)
  const spanRef = useRef(null)
  const watchImage = watchFields?.image

  function handleOpen(event: MouseEvent<HTMLDivElement>) {
    if (
      event.target !== checkboxRef.current &&
      event.target !== labelRef.current &&
      event.target !== spanRef.current &&
      event.target !== chatRef.current &&
      setIsModalOpen
    ) {
      setIsModalOpen(true)
      if (emp && setCurrentlyOpenedId) setCurrentlyOpenedId(emp.id)
    }
  }

  const [isChatOpened, setIsChatOpened] = useState(false)

  let displayAvatar = null
  if (watchImage && typeof watchImage === "object" && watchImage[0]) {
    displayAvatar = URL.createObjectURL(watchImage[0])
  } else if (emp?.image_path) {
    displayAvatar = serverDomain + emp?.image_path
  } else {
    displayAvatar = defaultPhoto
  }

  return (
    <>
      <div
        key={emp?.id}
        className={styles.employees}
        onClick={isMapping ? handleOpen : undefined}
        style={!isMapping ? { border: "none", padding: 0 } : {}}
      >
        <div className={styles.about}>
          {!register && (
            <img src={displayAvatar} alt="avatar" className={styles.avatar} />
          )}
          {register && watchFields && (
            <label>
              <input
                type="file"
                {...register("image")}
                accept=".jpg, .png, .jpeg"
                disabled={!isEditing}
              />
              <img src={displayAvatar} className={styles.preview} />
              {(isAdding || isEditing) && (
                <>
                  <img src={ellipseIcon} className={styles.ellipse} />
                  <img src={plusIcon} className={styles.plus} />
                </>
              )}
            </label>
          )}
          <div className={styles.info}>
            <div>
              {!isAdding && <span>{`${emp?.first_name} ${emp?.last_name}`}</span>}
              {isMapping && (
                <span className={styles.email}>{` | ${emp?.email}`}</span>
              )}
            </div>
            {!isAdding && (
              <div className={styles.role}>
                {RolesDict[emp?.role as keyof typeof RolesDict]}
              </div>
            )}
          </div>
        </div>
        <div className={styles.interaction}>
          {emp && emp?.role !== "courier" && (
            <button type="button" onClick={() => setIsChatOpened(true)}>
              <img src={chatIcon} alt="chat" ref={chatRef} />
            </button>
          )}
          {emp?.role !== "admin" && (
            <Switch
              isOn={emp?.is_active !== undefined ? emp.is_active : undefined}
              handleToggle={
                emp ? () => handleToggleIsActive(emp, dispatch) : undefined
              }
              colorOne="var(--blue, #00538E)"
              colorTwo="#CDDDE9"
              labelRef={labelRef}
              checkboxRef={checkboxRef}
              spanRef={spanRef}
              register={register}
              setValue={setValue}
            />
          )}
        </div>
      </div>

      <ModalWindow
        size="small"
        withLogo={false}
        isModaltOpen={isChatOpened}
        setIsModaltOpen={setIsChatOpened}
      >
        <SendMessage
          setIsNotifivationVisible={setIsNotifivationVisible}
          toUser={emp as any}
          setIsChatOpened={setIsChatOpened}
        />
      </ModalWindow>
    </>
  )
}

export default EmployeeCell
