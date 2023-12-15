import classNames from "classnames"
import { FC, useEffect, useState } from "react"
import styles from "./DetailedOffersTable.module.scss"
import Select from "react-select"
import moment from "moment"
import { selectStyles } from "components/Overview/taskOverview/offerTaskOverview/TaskInputs"
import { AppDispatch } from "types"
import { useDispatch } from "react-redux"
import { getOffersAdditionalInfo } from "reduxFolder/slices/Table.slice"
import { headersNamesDict, monthsOptions, yearsOptions } from "./OffersInfoConstants"
import OfferInfo from "./OfferInfo/OfferInfo"
import { IAdditionalOfferInfo } from "types/offers"
import { v1 } from "uuid"

const DetailedOffersTable: FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const defaultYear = yearsOptions.find((y) => +moment().format("YYYY") === y.value)
  const defaultMonth = monthsOptions.find((m) => +moment().format("MM") === m.value)

  const [currentYear, setCurrentYear] = useState(defaultYear)
  const [currentMonth, setCurrentMonth] = useState(defaultMonth)

  const [offersInfo, setOffersInfo] = useState<any>([])

  const [refreshOffersInfo, setRefreshOffersInfo] = useState(false)

  async function getOffersInfo(start_date: string, end_date: string) {
    const response = await dispatch(
      getOffersAdditionalInfo({ start_date, end_date })
    )
    setOffersInfo(response.payload?.result || [])
  }

  useEffect(() => {
    if (!currentYear || !currentMonth) return
    const currentYearValue = currentYear.value.toString()
    const currentMonthValue =
      currentMonth.value < 10
        ? `0${currentMonth.value}`
        : currentMonth.value.toString()

    const startDate = moment(`${currentYearValue}-${currentMonthValue}-01`).format(
      "YYYY-MM-DD"
    )
    const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD")

    getOffersInfo(startDate, endDate)
  }, [currentYear, currentMonth, refreshOffersInfo])

  const Headers = Object.keys(headersNamesDict).map((h) => {
    return <th key={v1()}>{headersNamesDict[h as keyof typeof headersNamesDict]}</th>
  })

  const OffersInfo = offersInfo.map((offer: IAdditionalOfferInfo) => (
    <OfferInfo
      key={offer.id}
      offer={offer}
      setRefreshOffersInfo={setRefreshOffersInfo}
    />
  ))

  return (
    <div className={styles.wraper}>
      <h1>Angebote übersicht</h1>

      <div className={styles.table}>
        <header>{`${currentMonth?.label} ${currentYear?.label}`}</header>
        <table className={styles.infoTable}>
          <thead>
            <tr>
              <th>{"Bearbeiten"}</th>
              {Headers}
            </tr>
          </thead>
          <tbody>{OffersInfo}</tbody>
        </table>
      </div>

      <div className={styles.date}>
        <div className={styles.picker}>
          <span className={classNames(styles.span, styles.active)}>{"Jahr"}</span>
          <Select
            styles={selectStyles}
            options={yearsOptions}
            defaultValue={defaultYear}
            menuPlacement="auto"
            isSearchable={false}
            onChange={(e) => setCurrentYear(e!)}
          />
        </div>
        <div className={styles.picker}>
          <span className={classNames(styles.span, styles.active)}>{"Monat"}</span>
          <Select
            styles={selectStyles}
            options={monthsOptions}
            defaultValue={defaultMonth}
            menuPlacement="auto"
            isSearchable={false}
            onChange={(e) => setCurrentMonth(e!)}
          />
        </div>
      </div>
    </div>
  )
}

export default DetailedOffersTable
