//styles
import styles from "./OrdersBarChart.module.scss"
//libs
import { BarChart, XAxis, Bar } from "recharts";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
//components
import MultiRangeSlider from "components/MultiRangeSlider/MultiRangeSlider";
import StatPanel from "components/StatPanel/StatPanel";
import ToggleSwitcher from "components/ToggleSwitcher/ToggleSwitcher";
import Select from "components/Select/Select";
//redux
import { fetchOrders } from "reduxFolder/slices/ordersSlice";
import { sortedOrdersSelector } from "reduxFolder/selectors";
//types
import { AppDispatch, OrderType, RootStateType } from "types";

const currentYear = new Date().getFullYear()
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const startOfDayInMillis = startOfDay.getTime();
const months = [
  { value: '0', text: 'Januar' },
  { value: '1', text: 'Februar' },
  { value: '2', text: 'März' },
  { value: '3', text: 'April' },
  { value: '4', text: 'Mai' },
  { value: '5', text: 'Juni' },
  { value: '6', text: 'Juli' },
  { value: '7', text: 'August' },
  { value: '8', text: 'September' },
  { value: '9', text: 'Oktober' },
  { value: '10', text: 'November' },
  { value: '11', text: 'Dezember' }
];

const OrdersBarChart = () => {
  const orders = useSelector(sortedOrdersSelector);
  const ordersLoadingStatus = useSelector(
    (state: RootStateType) => state.orders.ordersLoadingStatus
  );
  const response = useSelector(
    (state: RootStateType) => state.orders.ordersResponse
  );
  const [timePeriod, setTimePeriod] = useState<"Jahr" | "Monat">('Monat')
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [maxRange, setMaxRange] = useState<number>(startOfDayInMillis);
  const [minRange, setMinRange] = useState<number>(
    orders[0]?.date ? new Date(orders[0].date).getTime() : 0
  );
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (!response && !orders.length) {
      dispatch(fetchOrders());
    } else if (response && response.next) {
      dispatch(fetchOrders(response.next));
    }
    // eslint-disable-next-line
  }, [orders]);


  const chartData: {
    chartData: { date?: number; orders?: number }[],
    currentOrders: OrderType[],
    statData: {
      totalOffers: number,
      cencelOffers: number
    }
  } = useMemo(() => {
    const arr: { date?: number; orders?: number }[] = [];
    let currentOrders = orders

    if (orders.length) {

      if (timePeriod === "Jahr") {

        currentOrders = currentOrders.filter(order => {
          return new Date(order.date).getFullYear() >= new Date(minRange).getFullYear() &&
            new Date(order.date).getFullYear() <= new Date(maxRange).getFullYear()
        })


        for (let i = 0; i < (new Date(maxRange).getFullYear() - new Date(minRange).getFullYear() + 1); i++) {
          arr.push({
            date: new Date(minRange).getFullYear() + i,
            orders: 0,
          });
        }
        arr.forEach((item, i) => {
          const ordersOfThisMonth = currentOrders.filter(order => new Date(order.date).getFullYear() == item.date)
          item.orders = ordersOfThisMonth.length
        })

      } else if (timePeriod === "Monat") {

        currentOrders = currentOrders.filter(item => {
          return (new Date(item.date).getFullYear() === selectedYear) && (new Date(item.date).getMonth() === selectedMonth)
        })

        for (let i = 1; i <= (getDaysInMonth(selectedMonth, currentYear)); i++) {
          arr.push({
            date: i,
            orders: 0,
          });
        }

        arr.forEach((item, i) => {
          const ordersOfThisDay = currentOrders.filter(order => {
            return new Date(order.date).getDate() == item.date
          })
          item.orders = ordersOfThisDay.length
        })

      }

    }
    const statData = {
      totalOffers: currentOrders.length,
      cencelOffers: currentOrders.filter(order => order.status == "REFUSED").length
    }
    return {
      chartData: arr,
      currentOrders,
      statData
    }
    // eslint-disable-next-line
  }, [orders, timePeriod, selectedMonth, selectedYear, maxRange, minRange]);

  const onRageChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinRange(min);
      setMaxRange(max);
    },
    []
  );

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }


  const years = useMemo(() => {
    const years = orders.map((item) => new Date(item.date).getFullYear())
    return [...new Set(years)].map(item => ({ text: item.toString(), value: item.toString() }))
  }, [orders])

  return (
    <div className={styles.chartWrapper}>
      {ordersLoadingStatus === "loading" ? "loading..." : null}
      {ordersLoadingStatus === "error" ? "fehler..." : null}
      <div className={styles.toolBar}>
        <StatPanel
          content={[
            { label: "Angebote insgesamt", data: chartData.statData.totalOffers },
            { label: "Stornierte Angebote", data: chartData.statData.cencelOffers }
          ]}
        />
        <ToggleSwitcher value1="Monat" value2="Jahr" activeValue={timePeriod} setActiveValue={setTimePeriod as (arg: string) => void} />
      </div>
      <BarChart
        className={styles.chart}
        data={chartData.chartData.map((item) => ({
          name: new Date(item.date!).getMonth(),
          orders: item.orders,
        }))}
        width={1024}
        height={350}>
        <XAxis dataKey="name" tick={false} axisLine={{ stroke: 'rgba(1, 72, 124, 1)', strokeWidth: 4 }} />
        <Bar dataKey="orders" fill="rgba(1, 72, 124, 1)" radius={[8, 8, 0, 0]} />
      </BarChart>
      <div className={styles.selectWrapper}>
        {timePeriod === "Monat" ?
          <>
            <Select disable={false} label="Jahr" currentOption={selectedYear.toString()} setCurrentOption={setSelectedYear} options={years} />
            <Select disable={false} label="Monat" currentOption={selectedMonth.toString()} setCurrentOption={setSelectedMonth} options={months} />
          </> : <MultiRangeSlider dateFormat="Year" max={startOfDayInMillis} min={new Date(orders[0]?.date || 1000000).getTime()} onChange={onRageChange} />}
      </div>
    </div>
  );
}

export default OrdersBarChart