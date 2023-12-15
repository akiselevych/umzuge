//styles
import styles from "./LeadsBarChart.module.scss"
//libs
import { BarChart, XAxis, Bar, YAxis, LabelList } from "recharts";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
//components
import ToggleSwitcher from "components/ToggleSwitcher/ToggleSwitcher";
//redux
import { fetchFeadsStatisticByPeriod } from "reduxFolder/slices/Leads.slice";
//types
import { AppDispatch, RootStateType } from "types";





const LeadsBarChart = () => {
  const statistic = useSelector((state: RootStateType) => state.Leads.leadsStatisticByPeriod)
  const loadingStatus = useSelector((state: RootStateType) => state.Leads.fetchLeadsStatisticByPeriodStatus)

  const [timePeriod, setTimePeriod] = useState<"Jahr" | "Monat" | "Tag">('Monat')
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    let start_date: string, end_date: string;
    switch (timePeriod) {
      case "Tag":
        start_date = moment().format("YYYY-MM-DD");
        end_date = moment().format("YYYY-MM-DD");
        break;
      case "Monat":
        start_date = moment().subtract(1, "month").format("YYYY-MM-DD");
        end_date = moment().format("YYYY-MM-DD");
        break;
      case "Jahr":
        start_date = moment().subtract(1, "year").format("YYYY-MM-DD");
        end_date = moment().format("YYYY-MM-DD");
        break;
    }
    dispatch(fetchFeadsStatisticByPeriod({
      start_date,
      end_date
    }))
    // eslint-disable-next-line
  }, [timePeriod]);


  const total = Object.values(statistic?.current || {}).reduce((acc, item) => acc + item, 0)

  const chartData = useMemo(() => {
    const defaultData = [
      {
        name: 'B2C',
        current: statistic?.current?.B2C || 0,
        previous: statistic?.previous?.B2C || 0,
        prevLabel: (statistic?.previous.B2C || 0) - (statistic?.current.B2C || 0),
        currentLabel: (statistic?.current.B2C || 0) - (statistic?.previous.B2C || 0),
      },
      {
        name: 'B2B',
        current: statistic?.current?.B2B || 0,
        previous: statistic?.previous?.B2B || 0,
        prevLabel: (statistic?.previous.B2B || 0) - (statistic?.current.B2B || 0),
        currentLabel: (statistic?.current.B2B || 0) - (statistic?.previous.B2B || 0),
      },
      {
        name: 'Umzugspreis',
        current: statistic?.current?.Umzugspreis || 0,
        previous: statistic?.previous?.Umzugspreis || 0,
        prevLabel: (statistic?.previous.Umzugspreis || 0) - (statistic?.current.Umzugspreis || 0),
        currentLabel: (statistic?.current.Umzugspreis || 0) - (statistic?.previous.Umzugspreis || 0),
      },
      {
        name: '365',
        current: statistic?.current?.[365] || 0,
        previous: statistic?.previous?.[365] || 0,
        prevLabel: (statistic?.previous[365] || 0) - (statistic?.current[365] || 0),
        currentLabel: (statistic?.current[365] || 0) - (statistic?.previous[365] || 0),
      },
      {
        name: 'Telefon',
        current: statistic?.current?.Telefon || 0,
        previous: statistic?.previous?.Telefon || 0,
        prevLabel: (statistic?.previous.Telefon || 0) - (statistic?.current.Telefon || 0),
        currentLabel: (statistic?.current.Telefon || 0) - (statistic?.previous.Telefon || 0),
      },
      {
        name: 'E-Mail',
        current: statistic?.current?.["E-Mail"] || 0,
        previous: statistic?.previous?.["E-Mail"] || 0,
        prevLabel: (statistic?.previous["E-Mail"] || 0) - (statistic?.current["E-Mail"] || 0),
        currentLabel: (statistic?.current["E-Mail"] || 0) - (statistic?.previous["E-Mail"] || 0),
      },
    ]

    return defaultData
  }, [statistic])

  const renderLabel = (props: any) => {
    return props > 0 ? `+${props}` : `${props}`;
  };


  return (
    <div className={styles.chartWrapper}>

      <div className={styles.toolBar}>
        <div className={styles.total}>
          <p className={styles.totalName}>
            Gesamtbetrag
          </p>
          <p className={styles.totalValue}>
            {total}
          </p>
        </div>
        <ToggleSwitcher value1="Tag" value2="Monat" value3="Jahr" activeValue={timePeriod} setActiveValue={setTimePeriod as (arg: string) => void} />
      </div>
      <BarChart
        data={chartData}
        width={1024}
        height={350}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
        <XAxis dataKey="name" axisLine={{ stroke: 'rgba(1, 72, 124, 1)', strokeWidth: 4 }}>
        </XAxis>
        <YAxis hide={true} />
        <Bar dataKey="previous" fill="rgba(3, 104, 175, 0.43)" radius={[8, 8, 0, 0]}>
          <LabelList
            formatter={renderLabel}
            dataKey="prevLabel"
            position="top" />
        </Bar>
        <Bar dataKey="current" fill="rgba(1, 72, 124, 1)" radius={[8, 8, 0, 0]}>
          <LabelList
            formatter={renderLabel}
            dataKey="currentLabel"
            position="top" />
        </Bar>
      </BarChart>
      {loadingStatus === "loading" ? "loading..." : null}
      {loadingStatus === "error" ? "fehler..." : null}
    </div>
  );
}


export default LeadsBarChart