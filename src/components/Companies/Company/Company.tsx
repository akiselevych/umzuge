import { FC, useState, MouseEvent, useRef, useEffect } from "react"
import { ICompany } from "types/tables"
import styles from "./Company.module.scss"
import CopyToClipboard from "react-copy-to-clipboard"
import classNames from "classnames"
import ModalWindow from "components/ModalWindow/ModalWindow"
import CompanyCarTable from "./CompanyCarTable/CompanyCarTable"
import CompanyWorkersTable from "./CompanyWorkersTable/CompanyWorkersTable"
import pencilIcon from "assets/icons/pencil.svg"
import trashCanIcon from "assets/icons/trash_can.svg"
import { API } from "services/API"
import { useActions } from "hooks/useActions"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types/index"
import { editCompany } from "reduxFolder/slices/Table.slice"
import { useDebounce } from "hooks/useDebounce"

type PropsType = {
  company: ICompany
  handleCompanyClick: (id: number | null, event: MouseEvent<HTMLDivElement>) => void
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentCompany: React.Dispatch<React.SetStateAction<ICompany | undefined>>
  setIsDeleteNotifivationVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const companFieldsyDict = {
  address: "Adresse",
  email: "Email",
  phone: "Telefon",
}

const rankColors = {
  A: "#00ff00",
  B: "#ffe600",
  C: "#ff0000",
}

const Company: FC<PropsType> = ({
  company,
  handleCompanyClick,
  setIsEditModalOpen,
  setCurrentCompany,
  setIsDeleteNotifivationVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [copied, setCopied] = useState<string | null>(null)
  const [isCarPricesModalOpen, setIsCarPricesModalOpen] = useState(false)
  const [isfirstRender, setIsFirstRender] = useState(true)

  const [isWorkerPricesModalOpen, setIsWorkerPricesModalOpen] = useState(false)

  const [notes, setNotes] = useState(company.notes ?? "")
  const debouncedNotes = useDebounce(notes, 1000)
  const [rank, setRank] = useState(company.rank)

  useEffect(() => {
    if (isfirstRender) {
      setIsFirstRender(false)
      return
    }
    dispatch(editCompany({ id: company.id, data: { rank } }))
  }, [rank])

  useEffect(() => {
    if (isfirstRender) {
      setIsFirstRender(false)
      return
    }
    dispatch(editCompany({ id: company.id, data: { notes } }))
  }, [debouncedNotes])

  const { filterCompnies } = useActions()

  const handleCopy = (field: string) => {
    setCopied(field)
    setTimeout(() => {
      setCopied(null)
    }, 1500)
  }

  const Fields = Object.keys(companFieldsyDict).map((field) => (
    <div className={styles.cell} key={field}>
      <div className={styles.propName}>
        {companFieldsyDict[field as keyof typeof companFieldsyDict]}
      </div>
      <CopyToClipboard
        text={String(company[field as keyof ICompany])}
        onCopy={() => handleCopy(field)}
      >
        <div
          className={styles.propValue}
          title={field !== "workers_count" ? "Zum Kopieren anklicken" : ""}
        >
          {field === "workers_count"
            ? company[field as keyof ICompany] ?? "-"
            : company[field as keyof ICompany] || "-"}
        </div>
      </CopyToClipboard>
      <div
        className={classNames(styles.copied, copied !== field && styles.hidden)}
      />
    </div>
  ))

  //@ts-ignore
  const carsData = company.cars_info
  //@ts-ignore
  const workersData = company.workers_info

  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const sliderRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = (e: MouseEvent) => {
    if (!sliderRef.current) return
    setIsDown(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDown(false)
  }

  const handleMouseUp = () => {
    setIsDown(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleEditButtonClick = () => {
    setCurrentCompany(company)
    setIsEditModalOpen(true)
  }

  async function handleDelete() {
    const response = await API.deleteCompany(company.id)
    if (response.status.toString().startsWith("2")) {
      filterCompnies(company.id)
      setIsDeleteNotifivationVisible(true)
    }
  }



  return (
    <>
      <div
        className={styles.company}
        onClick={(e) => handleCompanyClick(company.id, e)}
      >
        <div className={styles.head}>
          <div
            className={styles.name}
            onClick={(e) => handleCompanyClick(company.id, e)}
          >
            <button onClick={handleEditButtonClick}>
              <img src={pencilIcon} alt="edit" />
            </button>
            {company.name}
          </div>
          <div>
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value as typeof company.rank)}
              style={{ backgroundColor: rankColors[rank] }}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>
        <div
          className={styles.info}
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className={classNames(styles.cell, styles.priceButton)}
            onClick={() => setIsWorkerPricesModalOpen((prev) => !prev)}
          >
            Preise für Arbeit
          </div>
          <div
            className={classNames(styles.cell, styles.priceButton)}
            onClick={() => setIsCarPricesModalOpen((prev) => !prev)}
          >
            Lkw-Preise
          </div>
          {Fields}
          <div className={styles.cell}>
            <div className={styles.propName}>Website</div>
            <div className={styles.propValue}>
              {company.website ? (
                <a href={company.website} target="_blank">
                  {company.website}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>
          <div className={styles.cell} style={{ width: 250 }}>
            <div className={styles.propName}>Notizen</div>
            <div className={styles.propValue}>
              <input
                className={styles.notesInput}
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button className={styles.deleteButton} onClick={handleDelete}>
          <img src={trashCanIcon} alt="delete" />
        </button>
      </div>
      <ModalWindow
        isModaltOpen={isCarPricesModalOpen}
        setIsModaltOpen={setIsCarPricesModalOpen}
        size="small"
        withLogo
      >
        <CompanyCarTable cars={carsData} companyId={company.id} />
      </ModalWindow>
      <ModalWindow
        isModaltOpen={isWorkerPricesModalOpen}
        setIsModaltOpen={setIsWorkerPricesModalOpen}
        size="large"
        withLogo
      >
        <CompanyWorkersTable companyId={company.id} workersData={workersData} />
      </ModalWindow>
    </>
  )
}

export default Company
