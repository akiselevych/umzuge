import { FC, useEffect, useState } from "react"
import MiniInfoCard from "./MiniInfoCard"
import styles from "components/TablesInfo/TablesInfo.module.scss"
import InfoCard from "./InfoCard"
import { downloadCSV } from "utils/downladCSV"
import { ILead, ITableStatistics } from "types/tables"
import { IOffer } from "types/offers"
import { getAllLeads } from "components/Overview/offerOverview/OfferOverview"
import { getAllOffers, getTablesStatisticValues } from "./getStatisticsFunctions"
import { useSelector } from "react-redux"
import { RootStateType } from "types/index"

type PropsType = {
}

const SaleManTablesInfo: FC<PropsType> = () => {
  const user = useSelector((state: RootStateType) => state.User.user)

  const [leads, setLeads] = useState<ILead[]>([])
  const [offers, setOffers] = useState<IOffer[]>([])
  const [statistics, setStatistics] = useState<ITableStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getTablesStatisticValues(user.id, setStatistics, setIsLoading),
      getAllLeads(setLeads),
      getAllOffers(setOffers),
    ])
  }, [])

  const downloadLeads = () => {
    downloadCSV(leads, "Leads")
  }
  const downloadOffers = () => {
    downloadCSV(offers, "Offers")
  }

  return (
    <div className={styles.cards}>
      <InfoCard
        name="Leads"
        values={statistics?.leadValues}
        handleDownload={downloadLeads}
        isLoading={isLoading}
      />
      <InfoCard
        name="Angebote"
        values={statistics?.offersValues}
        handleDownload={downloadOffers}
        isLoading={isLoading}
      />
      <div className={styles.miniCards}>
        <MiniInfoCard
          name="Konvertierungsrate"
          value={`${statistics?.converted_rate ?? 0}%`}
        />
        <MiniInfoCard
          name="Bonus für den Monat"
          value={`${statistics?.bonuses ?? 0} €`}
        />
        <MiniInfoCard
          name="Umsatz"
          value={`${statistics?.circulation ?? 0}€ Brutto`}
        />
      </div>
    </div>
  )
}

export default SaleManTablesInfo
