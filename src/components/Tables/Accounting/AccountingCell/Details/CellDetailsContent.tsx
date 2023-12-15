import { FC, useEffect, useState } from "react"
import styles from "./CellDetailsContent.module.scss"
import TablesBlock from "./DetailsComponents/TablesBlock/TablesBlock"
import WorkingTimeBlock from "./DetailsComponents/WorkingTimeBlock/WorkingTimeBlock"
import MainInfoBlock from "./DetailsComponents/MainInfoBlock"
import ChangePriceBlock from "./ChangePriceBlock/ChangePriceBlock"
import { ContractDetailsPropsType, OfferDetailsPropsType } from "../AccountingCell"
import CompaniesBlock from "./CompaniesBlock/CompaniesBlock"
import { ITask } from "types/calendar"
import { ACCOUNTING_API } from "services/ACCOUNTING_API"

type PropsType = {
  item_type: "offer" | "contract"
  contractProps: ContractDetailsPropsType | null
  offerProps: OfferDetailsPropsType | null
  isDetailsOpen: boolean
}

const ContractCellDetailsContent: FC<PropsType> = (props) => {
  const { item_type, contractProps, offerProps, isDetailsOpen } = props
  const currentProps = item_type === "contract" ? contractProps : offerProps

  const [tasks, setTasks] = useState<ITask[]>([])

	const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = []
    }
    acc[task.date].push(task)
    return acc
  }, {} as Record<string, ITask[]>)

  useEffect(() => {
    if (!isDetailsOpen) return

    getTasksByItemId()
  }, [isDetailsOpen])

	async function getTasksByItemId() {
		if (!currentProps) return
		const response = await ACCOUNTING_API.getTasksByItemId(
			item_type,
			currentProps.id
		)
		setTasks(response.results)
	}

  function handleOpenOffer() {
    if (currentProps?.pdf_file) {
      window.open(currentProps.pdf_file, "_blank")
    } else {
      alert("PDF-Datei nicht gefunden")
    }
  }
	
  if (!currentProps) return

  return (
    <div>
      <h2 className={styles.subtitle}>Wichtigste Informationen</h2>
      <MainInfoBlock {...currentProps.main_info} />
      {item_type === "contract" && contractProps && (
        <TablesBlock
          workers_info={contractProps.workers_info}
          cars_info={contractProps.cars_info}
        />
      )}
      <CompaniesBlock groupedTasks={groupedTasks} />
      <WorkingTimeBlock groupedTasks={groupedTasks} />
      <ChangePriceBlock
        itemType={item_type}
        id={currentProps.id}
        initialPrice={currentProps.price}
        initialComment={currentProps.payment_comment}
      />
      <div className={styles.buttons}>
        <button onClick={handleOpenOffer}>Angebot</button>
        <button>Abfahrtskontrolle</button>
        <button>Arbeitspapiere</button>
      </div>
    </div>
  )
}

export default ContractCellDetailsContent
