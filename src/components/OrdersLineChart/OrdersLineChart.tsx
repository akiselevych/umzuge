//libs
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
//components
import MultiRangeSlider from "components/MultiRangeSlider/MultiRangeSlider";
import StatPanel from "components/StatPanel/StatPanel";
//redux
import { fetchOrders } from "reduxFolder/slices/ordersSlice";
import { sortedOrdersSelector } from "reduxFolder/selectors";
//styles
import styles from "components/OrdersLineChart/OrdersLineChart.module.scss"
//types
import { AppDispatch, OrderType, RootStateType } from "types";

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const startOfDayInMillis = startOfDay.getTime();

const OrdersLineChart: React.FC = () => {
  const orders = useSelector(sortedOrdersSelector);
  const ordersLoadingStatus = useSelector(
    (state: RootStateType) => state.orders.ordersLoadingStatus
  );
  const response = useSelector(
    (state: RootStateType) => state.orders.ordersResponse
  );
  const dispatch = useDispatch<AppDispatch>();
  const [minRange, setMinRange] = useState<number>(
    orders[0]?.date ? new Date(orders[0].date).getTime() : 0
  );
  const [maxRange, setMaxRange] = useState<number>(startOfDayInMillis);
  const [timePerod, setTimePeriod] = useState<number>(0);

  useEffect(() => {
    if (!response && !orders.length) {
      dispatch(fetchOrders());
    } else if (response && response.next) {
      dispatch(fetchOrders(response.next));
    }
    // eslint-disable-next-line
  }, [orders]);

  useEffect(() => {
    if (orders.length) {
      const startDate = minRange
        ? minRange
        : new Date(orders[0].date).getTime();
      const endDate = maxRange;
      const timeDiff = Math.abs(endDate - startDate) / 4;
      setTimeout(() => setTimePeriod(timeDiff), 500);
    }
  }, [orders, maxRange, minRange]);

  const chartData: {
    chartData: { date?: string; orders?: number }[],
    currentOrders: OrderType[],
    statData: {
      totalOffers: number,
      cencelOffers: number
    }
  } = useMemo(() => {
    const arr: { date?: Date; orders?: number }[] = [];
    if (orders.length) {
      for (let i = 0; i < 5; i++) {
        arr.push({
          date: new Date(minRange + timePerod * i),
          orders: 0,
        });
      }
    }
    orders.forEach((order) => {
      for (let i = 0; i < 5; i++) {
        if (
          Math.abs(
            arr[i].date!.getTime() - new Date(order.date).getTime()
          ) <
          timePerod / 2
        ) {
          arr[i].orders = arr[i].orders ? arr[i].orders! + 1 : 1;
        }
      }
    });
    const currentOrders = orders.filter(order => {
      const orderTime = new Date(order.date).getTime()
      return orderTime <= maxRange && orderTime >= minRange
    })

    const statData = {
      totalOffers: currentOrders.length,
      cencelOffers: currentOrders.filter(order => order.status == "REFUSED").length
    }

    return {
      chartData: arr.map((item) => {
        return {
          orders: item.orders,
          date: item
            .date!.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
            .replace(/\//g, ". "),
        };
      }),
      currentOrders,
      statData
    }

    // eslint-disable-next-line
  }, [timePerod]);

  const onRageChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinRange(min);
      setMaxRange(max);
    },
    []
  );

  return (
    <div className={styles.chartWrapper}>
      {ordersLoadingStatus === "loading" ? "loading..." : null}
      {ordersLoadingStatus === "error" ? "error..." : null}
      <StatPanel
        content={[
          { label: "Angebote insgesamt", data: chartData.statData.totalOffers },
          { label: "Stornierte Angebote", data: chartData.statData.cencelOffers }
        ]}
      />
      <LineChart
        className={styles.chart}
        data={chartData.chartData.map((item) => ({
          name: item.date!,
          orders: item.orders,
        }))}
        width={776}
        height={350}
        margin={{ left: 1, bottom: -8, top: 2, right: 60 }}
      >
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#00538E"
          strokeWidth={3}
          dot={false}
        />
        <XAxis
          tickLine={false}
          tick={{ fill: "#bdbdbd" }}
          dataKey="name"
          axisLine={{ strokeWidth: 3 }}
          stroke="#000"
        />
        <YAxis
          axisLine={{ strokeWidth: 3 }}
          stroke="#000"
          tickLine={false}
          tick={{ fill: "#bdbdbd" }}
        />
        <ReferenceLine
          y={
            chartData.chartData.reduce(
              (sum, entry) => sum + entry.orders!,
              0
            ) / chartData.chartData.length
          }
          stroke="#00538E"
          strokeWidth={3}
        />
      </LineChart>
      <MultiRangeSlider
        dateFormat="Day-Month-Year"
        min={new Date(orders[0]?.date || 1000000).getTime()}
        max={startOfDayInMillis}
        onChange={onRageChange}
      />
    </div>
  );
};

export default OrdersLineChart;
