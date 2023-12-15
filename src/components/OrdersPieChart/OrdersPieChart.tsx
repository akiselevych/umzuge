//libs
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState, useMemo, useCallback, FC } from "react";
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
//styles
import styles from "./OrdersPieChart.module.scss";

import closeIcon from "assets/icons/closeIcon.svg";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const startOfDayInMillis = startOfDay.getTime();

const months = [
  { value: "0", text: "Januar" },
  { value: "1", text: "Februar" },
  { value: "2", text: "März" },
  { value: "3", text: "April" },
  { value: "4", text: "Mai" },
  { value: "5", text: "Juni" },
  { value: "6", text: "Juli" },
  { value: "7", text: "August" },
  { value: "8", text: "September" },
  { value: "9", text: "Oktober" },
  { value: "10", text: "November" },
  { value: "11", text: "Dezember" },
];

const OrdersPieChart: FC = () => {
  const orders = useSelector(sortedOrdersSelector);
  const ordersLoadingStatus = useSelector(
    (state: RootStateType) => state.orders.ordersLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();
  const [timePeriod, setTimePeriod] = useState<string>("Monat");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [maxRange, setMaxRange] = useState<number>(startOfDayInMillis);
  const [minRange, setMinRange] = useState<number>(
    orders[0]?.date ? new Date(orders[0].date).getTime() : 0
  );
  const response = useSelector(
    (state: RootStateType) => state.orders.ordersResponse
  );
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const handlePieClick = (data: unknown, index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!response && !orders.length) {
      dispatch(fetchOrders());
    } else if (response && response.next) {
      dispatch(fetchOrders(response.next));
    }
    // eslint-disable-next-line
  }, [orders]);

  useEffect(() => {
    setActiveIndex(null);
  }, [maxRange, minRange]);

  const chartData: {
    chartData: { date: Date; orders: OrderType[]; value: number }[];
    currentOrders: OrderType[];
    statData: {
      totalOffers: number;
      cencelOffers: number;
    };
  } = useMemo(() => {
    const arr: { date: Date; orders: OrderType[]; value: number }[] = [];
    let currentOrders = orders;

    if (orders.length) {
      if (timePeriod === "Jahr") {
        const minRangeSet0 = new Date(
          new Date(minRange).setHours(0, 0, 0)
        ).setDate(1);
        const maxRangeSet0 = new Date(
          new Date(maxRange).setHours(23, 59, 59)
        ).setDate(new Date(maxRange).getDate());
        currentOrders = currentOrders.filter((order) => {
          const orderTime = new Date(order.date).getTime();
          return orderTime >= minRangeSet0 && orderTime <= maxRangeSet0;
        });

        for (
          let i = 0;
          i <
          (new Date(maxRange).getFullYear() -
            new Date(minRange).getFullYear()) *
            12 +
            (new Date(maxRange).getMonth() - new Date(minRange).getMonth()) +
            1;
          i++
        ) {
          arr.push({
            date: new Date(new Date(minRange).setDate(15) + i * 2629746000),
            orders: [],
            value: 1,
          });
        }
        arr.forEach((period) => {
          const ordersOfThisMonth = currentOrders.filter((order) => {
            return (
              period.date?.getMonth() === new Date(order.date).getMonth() &&
              period.date?.getFullYear() === new Date(order.date).getFullYear()
            );
          });
          period.orders = ordersOfThisMonth;
        });
      } else if (timePeriod === "Monat") {
        currentOrders = currentOrders.filter((item) => {
          return (
            new Date(item.date).getFullYear() === selectedYear &&
            new Date(item.date).getMonth() === selectedMonth
          );
        });
        for (let i = 1; i <= getDaysInMonth(selectedMonth, currentYear); i++) {
          arr.push({
            date: new Date(selectedYear, selectedMonth, i),
            orders: [],
            value: 0,
          });
        }

        arr.forEach((item, i) => {
          const ordersOfThisDay = currentOrders.filter((order) => {
            return new Date(order.date).getDate() == item.date.getDate();
          });
          if (ordersOfThisDay.length > 0) {
            item.orders = ordersOfThisDay;
          }
        });
      }
    }
    const statData = {
      totalOffers: currentOrders.length,
      cencelOffers: currentOrders.filter((order) => order.status == "REFUSED")
        .length,
    };
    return {
      chartData: arr,
      currentOrders,
      statData,
    };

    // eslint-disable-next-line
  }, [orders, timePeriod, selectedYear, selectedMonth, maxRange, minRange]);

  const onRageChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinRange(min);
      setMaxRange(max);
    },
    []
  );

  const years = useMemo(() => {
    const years = orders.map((item) => new Date(item.date).getFullYear());
    return [...new Set(years)].map((item) => ({
      text: item.toString(),
      value: item.toString(),
    }));
  }, [orders]);

  const calcSectionData = useMemo(() => {
    let percent = 0;
    let totalOffers = 0;
    let cenlelOffers = 100000;
    let year = 11;
    let month = "";
    if (typeof activeIndex == "number" && chartData.chartData.length) {
      const period = chartData.chartData[activeIndex];
      percent = period.orders
        ? Math.round(
            (100 / chartData.currentOrders.length) * period.orders.length
          )
        : 0;
      year = period.date
        ? timePeriod === "Monat"
          ? selectedYear
          : period.date?.getFullYear()
        : 0;
      month = period.date
        ? timePeriod === "Monat"
          ? (period.date.getDate()).toString() + " day"
          : months.find((item) => +item.value === period.date.getMonth())
              ?.text ?? "---"
        : "---";
      totalOffers = chartData.chartData[activeIndex].orders?.length || 0;
      cenlelOffers = period.orders
        ? period.orders.filter((item) => item.status == "REFUSED").length
        : 0;
    }
    return {
      activeIndex,
      setActiveIndex,
      timePeriod,
      percent,
      totalOffers,
      cenlelOffers,
      year,
      month,
    };
    // eslint-disable-next-line
  }, [chartData, activeIndex]);

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  return (
    <div className={styles.chartWrapper}>
      {ordersLoadingStatus === "loading" ? "loading..." : null}
      {ordersLoadingStatus === "error" ? "fehler..." : null}
      <div className={styles.toolBar}>
        <StatPanel
          content={[
            {
              label: "Angebote insgesamt",
              data: chartData.statData.totalOffers,
            },
            {
              label: "Stornierte Angebote",
              data: chartData.statData.cencelOffers,
            },
          ]}
        />
        <ToggleSwitcher
          value1="Monat"
          value2="Jahr"
          activeValue={timePeriod}
          setActiveValue={(value: string) => {
            setTimePeriod(value);
            setActiveIndex(null);
          }}
        />
      </div>
      <div className={styles.bodyWrapper}>
        <PieChart width={390} height={390}>
          <Pie
            data={chartData.chartData.map((item, i) => {
              return {
                name: new Date(item.date).getDate(),
                orders: item.orders?.length,
                value: item.orders
                  ? Math.round(
                      (100 / chartData.currentOrders.length) *
                        item.orders.length
                    )
                    ? Math.round(
                        (100 / chartData.currentOrders.length) *
                          item.orders.length
                      )
                    : 1
                  : 0,
              };
            })}
            dataKey="value"
            nameKey="orders"
            cx="50%"
            cy="50%"
            outerRadius={180}
            fill="#00538E"
            onClick={handlePieClick}
          >
            {chartData.chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`rgba(0,83,142,${
                  1 -
                  (0.2 + ((70 / chartData.chartData.length) * index + 1) / 100)
                })`}
                opacity={1}
                strokeWidth="5px"
                style={{
                  transform: `scale(${index === activeIndex ? 1.1 : 1})`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </Pie>
        </PieChart>
        {activeIndex !== null && (
          <SectionData
            activeIndex={calcSectionData.activeIndex}
            setActiveIndex={calcSectionData.setActiveIndex}
            timePeriod={calcSectionData.timePeriod}
            percent={calcSectionData.percent}
            totalOffers={calcSectionData.totalOffers}
            cenlelOffers={calcSectionData.cenlelOffers}
            year={calcSectionData.year}
            month={calcSectionData.month}
          />
        )}
      </div>
      <div className={styles.selectWrapper}>
        {timePeriod === "Monat" ? (
          <>
            <Select
              disable={false}
              label="Jahr"
              currentOption={selectedYear.toString()}
              setCurrentOption={setSelectedYear}
              options={years}
            />
            <Select
              disable={false}
              label="Monat"
              currentOption={selectedMonth.toString()}
              setCurrentOption={setSelectedMonth}
              options={months}
            />
          </>
        ) : (
          <MultiRangeSlider
            maxDiffer={2592000000 * 23}
            dateFormat="Month-Year"
            max={startOfDayInMillis}
            min={new Date(
              orders[0]?.date || startOfDayInMillis - 1000000
            ).getTime()}
            onChange={onRageChange}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPieChart;

const SectionData: FC<{
  activeIndex: null | number;
  setActiveIndex: (arg: number | null) => void;
  timePeriod: string;
  percent: number;
  totalOffers: number;
  cenlelOffers: number;
  year: number;
  month: string;
}> = ({
  setActiveIndex,
  timePeriod,
  percent,
  totalOffers,
  cenlelOffers,
  year,
  month,
}) => {
  return (
    <div className={styles.sectionData}>
      <div className={styles.sectionDataBlock}>
        <div className={styles.textBlock}>
          <p className={`${styles.blueText} ${styles.textBlockTitle}`}>
            {percent}%
          </p>
          <p className={styles.textBlockTitle}>
            {timePeriod === "Monat"
              ? "Monatliche Statistiken"
              : "Statistiken für das Jahr"}
          </p>
        </div>
        <img
          onClick={() => setActiveIndex(null)}
          className={styles.closeButton}
          src={closeIcon}
          alt="close"
        />
      </div>
      <div className={styles.sectionDataBlock}>
        <div className={styles.textBlock}>
          <p className={styles.itemData}>{month}</p>
          <div className={styles.item}>
            <div className={styles.itemLabel}>Angebote insgesamt</div>
            <div className={styles.itemData}>{totalOffers}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>Stornierte Angebote</div>
            <div className={styles.itemData}>{cenlelOffers}</div>
          </div>
        </div>
        <p className={styles.blueText}>{year}</p>
      </div>
    </div>
  );
};
