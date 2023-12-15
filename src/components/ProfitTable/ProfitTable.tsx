//libs
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//redux
import { fetchProfitStatistic } from "reduxFolder/slices/ordersSlice"
//components
import ProfitList from "components/ProfitList/ProfitList";
import MultiRangeSlider from "components/MultiRangeSlider/MultiRangeSlider"
//styles
import styles from "./ProfitTable.module.scss"
//types
import { AppDispatch, RootStateType } from "types/index";
import moment from "moment";

const germanMonthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const startOfDayInMillis = startOfDay.getTime();

const ProfitTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const stat = useSelector((state: RootStateType) => state.orders.profitStatistic)
    const statLoadingStatus = useSelector((state: RootStateType) => state.orders.profitStatisticLoadingStatus)
    const [startDate, setStartDate] = useState<number>(Object.values(stat).length ?
        moment(`${Object.keys(stat)[0]}-${Object.keys(Object.values(stat)[0])[0]}-01`).valueOf() : 0)
    const [endDate, setEndDate] = useState<number>(startOfDayInMillis)

    useEffect(() => {
        dispatch(fetchProfitStatistic({
            endDate: moment(endDate).endOf('month').format("YYYY-MM-DD"),
            startDate: moment(startDate).startOf('month').format("YYYY-MM-DD")
        }))
        //eslint-disable-next-line
    }, [startDate, endDate])

    const mapedData: {
        title: string,
        data: any
    }[] = []


    Object.entries(stat).forEach(year => {
        Object.entries(year[1]).forEach(month => {
            const monthIndex = parseInt(month[0]);
            const germanMonthName = germanMonthNames[monthIndex];
            const statItem = {
                title: germanMonthName + ' ' + year[0],
                data: Object.values(month[1])
            };
            mapedData.push(statItem);
        });
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.table}>
                <div className={styles.listWrapper}>
                    {mapedData.map(({ title, data }, i) => <ProfitList title={title} data={data} key={i} />)}
                    {statLoadingStatus === "loading" ? "loading..." : null}
                    {statLoadingStatus === "error" ? "fehler..." : null}
                    {mapedData.length === 0 && statLoadingStatus === "idle" ? "Keine Daten" : null}
                </div>
            </div>
            <div className={styles.sliderWrapper}>
                <MultiRangeSlider
                    max={startOfDayInMillis}
                    min={moment("2022-01-01", "YYYY-MM-DD").valueOf()}
                    dateFormat="Month-Year"
                    onChange={({ min, max }: { min: number; max: number }) => {
                        setStartDate(min);
                        setEndDate(max);
                    }} />
            </div>
        </div>
    );
}

export default ProfitTable