import { FC, useEffect } from "react"
import { useActions } from "hooks/useActions"
import {
  ContractDisplayCategoriesType,
  LeadDisplayCategoriesType,
  OfferDisplayCategoriesType,
} from "types/tables"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import CategoriesList from "./CategoriesList"
import {
  contractTableAdminCategoriesDict,
  contractTableSaleManCategoriesDict,
  leadTableCategoriesDict,
  offerTableCategoriesDict,
} from "./categoriesDicts"

const TablesCategoriesList: FC = () => {
  const leadDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.leadDisplayCategory
  )
  const offerDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.offerDisplayCategory
  )
  const contractDisplayCategory = useSelector(
    (state: RootStateType) => state.Table.contractDisplayCategory
  )

  const currentTableName = useSelector(
    (state: RootStateType) => state.Table.currentTableName
  )
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  )
  const user = useSelector((state: RootStateType) => state.User.user)

  const {
    setLeadDisplayCategory,
    setOfferDisplayCategory,
    setContractDisplayCategory,
  } = useActions()

  useEffect(() => {
    setOfferDisplayCategory("All")
    setContractDisplayCategory("Pending")
  }, [currentWorkflow])

  useEffect(() => {
    setLeadDisplayCategory("Active")
		setOfferDisplayCategory("All")
		setContractDisplayCategory("Pending")
  }, [currentTableName])

  let displayCategoriesList = <></>
  switch (currentTableName) {
    case "Leads": {
      displayCategoriesList = (
        <CategoriesList<LeadDisplayCategoriesType>
          categoriesDict={leadTableCategoriesDict}
          currentCategory={leadDisplayCategory}
          setCurrentCategory={setLeadDisplayCategory}
        />
      )
      break
    }
    case "Offers": {
      displayCategoriesList =
        currentWorkflow === "Admin" && user?.role === "admin" ? (
          <CategoriesList<OfferDisplayCategoriesType>
            categoriesDict={offerTableCategoriesDict}
            currentCategory={offerDisplayCategory}
            setCurrentCategory={setOfferDisplayCategory}
          />
        ) : (
          <></>
        )
      break
    }
    case "Contracts": {
      displayCategoriesList =
        currentWorkflow === "Admin" && user?.role === "admin" ? (
          <CategoriesList<ContractDisplayCategoriesType>
            categoriesDict={contractTableAdminCategoriesDict}
            currentCategory={contractDisplayCategory}
            setCurrentCategory={setContractDisplayCategory}
          />
        ) : (
          <CategoriesList<Partial<ContractDisplayCategoriesType>>
            categoriesDict={contractTableSaleManCategoriesDict}
            currentCategory={contractDisplayCategory}
            setCurrentCategory={setContractDisplayCategory}
          />
        )
      break
    }
    default:
      displayCategoriesList = <></>
      break
  }

  return displayCategoriesList
}

export default TablesCategoriesList
