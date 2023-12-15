import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  loadMoreContracts,
  loadMoreLeads,
  loadMoreOffers,
} from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import styles from "./LoadMoreButton.module.scss"

type ItemType = "offers" | "leads" | "contracts"

const LoadMoreButton: FC<{ item: ItemType }> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>()

  const isLastPage = useSelector((state: RootStateType) => state.Table.isLastPage)

  const loadMoreItems: Record<ItemType, () => void> = {
    leads: () => dispatch(loadMoreLeads()),
    offers: () => dispatch(loadMoreOffers()),
    contracts: () => dispatch(loadMoreContracts()),
  }
	
  function handleLoadMore() {
    loadMoreItems[item]()
  }

  if (isLastPage) return <></>

  return (
    <div className={styles.loadMoreButton} onClick={handleLoadMore}>
      Mehr laden
    </div>
  )
}

export default LoadMoreButton
