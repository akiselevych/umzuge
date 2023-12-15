import ModalWindow from "components/ModalWindow/ModalWindow"
import OfferOverview from "components/Overview/offerOverview/OfferOverview"
import moment from "moment"
import { FC, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { getEmployeeById } from "reduxFolder/slices/Calendar.slice"
import { getBonusesForEmployee, getOffers } from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import { IOffer } from "types/offers"
import styles from "./SaleManInfo.module.scss"
import "styles/index.scss"
import classNames from "classnames"
import { IBonus } from "types/tables"
import Select, { SingleValue } from "react-select"
import { selectStyles } from "components/Overview/taskOverview/offerTaskOverview/TaskInputs"
import { API } from "services/API"
import { getQueryString } from "utils/getQueryString"

const SaleManInfo: FC<{ saleManId?: string }> = ({ saleManId }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<IOffer | null>(null)

  const saleMan =
    saleManId !== undefined
      ? useSelector((state: RootStateType) => state.Calendar.currentlyOpenedSaleMan)
      : useSelector((state: RootStateType) => state.User.user)

  const [saleManBonuses, setSaleManBonuses] = useState<IBonus[] | null>(null)
  const [saleManOffers, setSaleManOffers] = useState<IOffer[] | null>(null)

  const [currentYear, setCurrentYear] = useState(+moment().format("YYYY"))
  const [currentMonth, setCurrentMonth] = useState(
    moment(`${currentYear}-01-01`).startOf("month").format("YYYY-MM-DD")
  )

  const monthStart = moment(currentMonth).startOf("month").format("YYYY-MM-DD")
  const monthEnd = moment(currentMonth).endOf("month").format("YYYY-MM-DD")

  const years = useMemo(() => {
    const years = []
    for (let i = 2000; i <= +moment().format("YYYY"); i++) {
      years.push(i)
    }
    return years.reverse()
  }, [])
  const yearsOptions = years.map((year) => ({ value: year, label: year }))

  const currentBonus = useMemo(() => {
    if (!saleManBonuses) return 0
    return saleManBonuses.find((bonus) => bonus.date === currentMonth)?.bonuses
  }, [saleManBonuses, currentMonth, currentYear])

  useEffect(() => {
    if (saleManId) {
      dispatch(getEmployeeById(saleManId))
    }
  }, [saleMan])

  useEffect(() => {
    getSaleManBonuses()
  }, [saleMan, currentYear])
  useEffect(() => {
    getSaleManOffers()
  }, [saleMan, currentYear, currentMonth])

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [saleManOffers, saleManBonuses])

  const maxBonus = useMemo(() => {
    if (!saleManBonuses) return 0
    return Math.max(...saleManBonuses.map((bonus) => +bonus.bonuses))
  }, [saleManBonuses])

  if (!saleManOffers || !saleManBonuses) return <div>Laden...</div>

  const TableCells = saleManOffers.map((offer, i) => {
    return (
      <div
        key={i}
        className={styles.cellGroup}
        onClick={() => handleTableCellClick(offer)}
      >
        <div className={styles.cell}>{offer.delivery_number}</div>
        <div className={styles.cell}>{offer.price}</div>
      </div>
    )
  })

  async function getSaleManBonuses() {
    if (saleMan) {
      const bonusesData = await dispatch(
        getBonusesForEmployee({
          employee_id: saleMan.id,
          dateAfter: `${currentYear}-01-01`,
          dateBefore: `${currentYear}-12-31`,
        })
      )
      setSaleManBonuses(bonusesData.payload)
      if (bonusesData.payload.length === 0) {
        setSaleManOffers([])
      }
    }
  }
  async function getSaleManOffers() {
    if (saleMan) {
      const filters = {
        sale_man_ids: saleMan.id,
        start_date_after: monthStart,
        start_date_before: monthEnd,
      }
      const offersData = await API.getOffers(getQueryString(filters))
      setSaleManOffers(offersData.results as IOffer[])
    }
  }
  function handleTableCellClick(offer: IOffer) {
    setCurrentOffer(offer)
    setIsModalOpen(true)
  }

  function handleYearChange(
    option: SingleValue<{
      value: number
      label: number
    }>
  ) {
    setCurrentYear(option?.value as number)
    setCurrentMonth(
      moment(`${option?.value}-01-01`).startOf("month").format("YYYY-MM-DD")
    )
  }

  function getInt(value: number | string | undefined) {
    return value?.toString()?.split(".")[0]
  }

  return (
    <>
      <div className={styles.saleMan}>
        <div className={styles.chartSection}>
          <div className={styles.salary}>
            <div className={styles.block}>
              <h2 className="modalTitle">Bonus</h2>
              <div>
                <div className={styles.subtitle}>Aufgelaufene Boni</div>
                <div className={styles.amount}>{getInt(currentBonus) || 0} €</div>
              </div>
            </div>
            <div className={styles.block}>
              <h2 className="modalTitle">Lohn</h2>
              <div>
                <div className={styles.subtitle}>Aufgelaufene lohn</div>
                <div className={styles.amount}>
                  {getInt(saleMan?.const_salary) || 0} €
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chart}>
            {saleManBonuses.length !== 0 ? (
              <LineChart
                layout="horizontal"
                width={700}
                height={210}
                data={saleManBonuses}
                margin={{
                  top: 0,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                onClick={(event) => setCurrentMonth(event.activeLabel as string)}
              >
                <XAxis
                  dataKey="date"
                  type="category"
                  axisLine={{ stroke: "#323334", strokeWidth: 3 }}
                />
                <YAxis
                  tickFormatter={(value: any) => `${value}€`}
                  type="number"
                  domain={[0, maxBonus + 100]}
                  axisLine={{ stroke: "#323334", strokeWidth: 3 }}
                />
                <Tooltip />
                <Line
                  dataKey="bonuses"
                  stroke="var(--blue, #00538E)"
                  strokeWidth={3}
                />
              </LineChart>
            ) : (
              "No data"
            )}
          </div>

          <div className={styles.date}>
            <div className={styles.group}>
              <Select
                defaultValue={yearsOptions.find(
                  (year) => year.value === +currentYear
                )}
                options={yearsOptions}
                placeholder="Jahr"
                styles={selectStyles}
                onChange={handleYearChange}
                menuPlacement="top"
              />
              <span className={classNames(styles.span, styles.active)}>
                {"Jahr"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.cellGroup}>
            <div className={styles.cell}>Nummer</div>
            <div className={styles.cell}>Preis</div>
          </div>
          {TableCells}
          {!TableCells.length && (
            <div style={{ paddingLeft: "10px" }}>No offers</div>
          )}
        </div>
      </div>

      <ModalWindow
        isModaltOpen={isModalOpen}
        setIsModaltOpen={setIsModalOpen}
        size="small"
        withLogo
      >
        <OfferOverview
          offer={currentOffer as IOffer}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalWindow>
    </>
  )
}

export default SaleManInfo
