//styles
import styles from "./OrdersBarChart.module.scss"
import React from "react";
//libs
import { BarChart, XAxis, Bar, Tooltip } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
//components
import Select from "components/Select/Select";
//redux
import { getVacationOfSpecialWorker } from "reduxFolder/slices/Calendar.slice";
//types
import { AppDispatch, RootStateType } from "types";


const currentYear = new Date().getFullYear()
//@ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>

        {payload[0].payload.periods.map((item: string, i: number) => {
          return <p key={i}>{item}</p>
        })}
        {!payload[0].payload.periods.length && <p>Kein Urlaub</p>}
      </div>
    );
  }

  return null;
};


const startChartData = [
  { value: '1', month: 'Januar', totalDays: 0, periods: [] },
  { value: '2', month: 'Februar', totalDays: 0, periods: [] },
  { value: '3', month: 'März', totalDays: 0, periods: [] },
  { value: '4', month: 'April', totalDays: 0, periods: [] },
  { value: '5', month: 'Mai', totalDays: 0, periods: [] },
  { value: '6', month: 'Juni', totalDays: 0, periods: [] },
  { value: '7', month: 'Juli', totalDays: 0, periods: [] },
  { value: '8', month: 'August', totalDays: 0, periods: [] },
  { value: '9', month: 'Sept.', totalDays: 0, periods: [] },
  { value: '10', month: 'Oktober', totalDays: 0, periods: [] },
  { value: '11', month: 'Nov.', totalDays: 0, periods: [] },
  { value: '12', month: 'Dezember', totalDays: 0, periods: [] }
];

const VacationsBarChart = ({ workerId }: { workerId: string | number }) => {
  const vacations = useSelector((state: RootStateType) => state.Calendar.vacationOfSpecialWorker);
  const loadingStatus = useSelector((state: RootStateType) => state.Calendar.vacationOfSpecialWorkerLoadingStatus);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const dispatch = useDispatch<AppDispatch>();



  useEffect(() => {
    dispatch(getVacationOfSpecialWorker({
      start_date: `${selectedYear}-01-01`,
      end_date: `${selectedYear}-12-31`,
      id: workerId
    }))
    // eslint-disable-next-line
  }, [selectedYear]);




  const chartData: {
    month: string,
    totalDays: number,
    periods: string[],
    value: string

  }[]
    = useMemo(() => {
      if (!vacations || vacations && !Object.keys(vacations).length) {
        return startChartData
      } else {


        const mapedVacations = Object.entries(Object.values(vacations)[0][selectedYear]).map((month, index) => ({
          value: month[0],
          totalDays: month[1].total_days,
          periods: month[1].duration.map(item => `${item.start_date} - ${item.end_date}`)
        }))

        return startChartData.map(item => {
          const m = mapedVacations.find(vacation => vacation.value === item.value)
          return m ? { ...m, month: item.month, totalDays: +m.totalDays } : item
        })


      }
      // eslint-disable-next-line
    }, [vacations]);



  const startYear = 2022;

  const years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push({ text: year.toString(), value: year.toString() });
  }



  return (
    <div className={styles.chartWrapper}>
      {loadingStatus === "loading" ? "loading..." : null}
      {loadingStatus === "error" ? "fehler..." : null}
      <div className={styles.toolBar}>
        <div className={styles.TextBlock}>
          <div className={styles.TextBlockTitle}>Urlaub</div>
          <div className={styles.TextBlockYear}>{selectedYear}</div>
        </div>
        <Select disable={false} currentOption={selectedYear.toString()} setCurrentOption={setSelectedYear} options={years} />
      </div>
      <BarChart className={styles.chart} data={chartData} width={1024} height={350}>
        <Tooltip content={<CustomTooltip active={"---"} payload={"----"} label={"---"} />} cursor={{ fill: "transparent" }} />
        <XAxis dataKey="month" tick={true} axisLine={{ stroke: 'rgba(1, 72, 124, 1)', strokeWidth: 4 }} />
        <Bar label={{ position: "top", fill: "black" }} dataKey="totalDays" fill="rgba(1, 72, 124, 1)" radius={[8, 8, 0, 0]}>
        </Bar>
      </BarChart>
    </div>

  );
}

export default VacationsBarChart

