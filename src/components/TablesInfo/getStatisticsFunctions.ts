import { API, instance } from "services/API"
import { IOffer } from "types/offers"
import { ITableStatistics } from "types/tables"

export async function getAllOffers(
  setOffers: React.Dispatch<React.SetStateAction<IOffer[]>>
) {
  let response = await API.getOffers("delivery_status=&is_archived=true,false")
  setOffers(response.results)

  while (response.next) {
    const nextPageResponse = await instance.get(response.next.split(".de")[1])
    setOffers((prev) => [...prev, ...nextPageResponse.data.results])
    response = nextPageResponse.data
  }
}

export async function getTablesStatisticValues(
  user_id: string,
  setValues: React.Dispatch<React.SetStateAction<ITableStatistics | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    setIsLoading(true)
    const [response, goalResponse] = await Promise.all([
      API.getTableStatistics(user_id),
      API.getTargetForTableStatistics(user_id),
    ])

    const statistics: ITableStatistics = {
      leadValues: [
        {
          label: "Erhalten",
          value: response.leads.receive,
          goal: { id: goalResponse.id, value: goalResponse.leads_received },
					edit_name: "leads_received"
        },
        {
          label: "Offen",
          value: response.leads.open,
        },
        {
          label: "Konvertierte Leads",
          value: `${response.leads.converted_rate}%`,
          goal: { id: goalResponse.id, value: goalResponse.leads_converted_rate },
					edit_name: "leads_converted_rate"
        },
      ],
      offersValues: [
        {
          label: "Versendet",
          value: response.angebot.sent,
          goal: { id: goalResponse.id, value: goalResponse.angebot_sent },
					edit_name: "angebot_sent"
        },
        {
          label: "Offen",
          value: response.angebot.open,
        },
        {
          label: "Konvertierte Angebote",
          value: `${response.angebot.converted_rate}%`,
          goal: { id: goalResponse.id, value: goalResponse.angebot_converted_rate },
					edit_name: "angebot_converted_rate"
        },
      ],
      converted_rate: response.converted_rate,
      bonuses: response.bonuses,
      circulation: response.circulation,
    }
    setValues(statistics)
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}
