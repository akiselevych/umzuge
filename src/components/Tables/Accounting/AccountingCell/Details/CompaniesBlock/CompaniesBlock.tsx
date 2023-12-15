import React, { FC } from "react"
import Company from "./Company"
import { ITask } from "types/calendar"
import detailsContentStyles from "../../Details/CellDetailsContent.module.scss"
import styles from "./CompaniesBlock.module.scss"

type PropsType = {
  groupedTasks: Record<string, ITask[]>
}

type CompanyCarsAndWorkersType = {
  cars: { name: string; amount: number }[]
  workers: { name: string; amount: number }[]
}

const CompaniesBlock: FC<PropsType> = ({ groupedTasks }) => {
  const CompaniesExternalsComponents = Object.entries(groupedTasks).map(
    ([date, tasks], i) => {
      const companiesCarsAndWorkers = tasks.reduce(aggregateWorkers, {})
      tasks[0].car.forEach((car) => {
        if (!car.company_name) return
        aggregateCars(companiesCarsAndWorkers, {
          company_name: car?.company_name,
          type: car?.type || "Unbekannt",
        })
      })

      const groupedItemsComponents = Object.entries(companiesCarsAndWorkers).map(
        ([company_name, companyItems]) => (
          <Company
            key={company_name}
            company_name={company_name}
            cars={companyItems.cars}
            workers={companyItems.workers}
          />
        )
      )

      return groupedItemsComponents.length !== 0 ? (
        <div key={date} className={styles.companyWrapper}>
          {Object.keys(groupedTasks).length > 1 && (
            <div className={detailsContentStyles.subtitle}>Tag {i + 1}</div>
          )}
          <div>{groupedItemsComponents}</div>
        </div>
      ) : (
        <React.Fragment key={date}></React.Fragment>
      )
    }
  )
  return CompaniesExternalsComponents.length !== 0 ? (
    <div className={styles.companies}>{CompaniesExternalsComponents}</div>
  ) : (
    <></>
  )
}

export default CompaniesBlock

function aggregateWorkers(
  acc: Record<string, CompanyCarsAndWorkersType>,
  task: ITask
) {
  if (!task.external_workers) return acc

  const companyName = task.external_workers.company_name
  if (!acc[companyName]) {
    acc[companyName] = {
      cars: [],
      workers: [],
    }
  }

  const workerEntry = acc[companyName].workers.find(
    (w) => w.name === task.external_workers?.type
  )
  if (workerEntry) {
    workerEntry.amount += 1
  } else {
    acc[companyName].workers.push({
      name: task.external_workers.type || "Unbekannt",
      amount: 1,
    })
  }

  return acc
}

function aggregateCars(
  acc: Record<string, CompanyCarsAndWorkersType>,
  car: { company_name: string; type: string }
) {
  if (!car.company_name) return acc

  if (!acc[car.company_name]) {
    acc[car.company_name] = { cars: [], workers: [] }
  }

  const carEntry = acc[car.company_name].cars.find((c) => c.name === car.type)

  if (carEntry) {
    carEntry.amount += 1
  } else {
    acc[car.company_name].cars.push({
      name: car.type || "Unbekannt",
      amount: 1,
    })
  }

  return acc
}
