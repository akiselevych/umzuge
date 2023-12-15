import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOrders } from "reduxFolder/slices/Table.slice"
import { AppDispatch, RootStateType } from "types"
import OffersTable from "../Offers/OffersTable"
import styles from '../Tables.module.scss'

const OrdersTable: FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const orders = useSelector((state: RootStateType) => state.Table.tables.Orders)

  useEffect(() => {
    dispatch(getOrders())
  }, [])

	if(!orders) return <div className={styles.stateMessage}>Laden...</div>

  return <OffersTable table={orders} />
}

export default OrdersTable
