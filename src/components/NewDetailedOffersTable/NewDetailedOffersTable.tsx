import classNames from "classnames"
import {FC, useEffect, useState} from "react"
import styles from "./DetailedOffersTable.module.scss"
import Select from "react-select"
import moment from "moment"
import {selectStyles} from "components/Overview/taskOverview/offerTaskOverview/TaskInputs"
import {AppDispatch, NewDetailedOffersProps, RootStateType} from "types"
import {useDispatch, useSelector} from "react-redux"
import {getOffersAdditionalInfo} from "reduxFolder/slices/Table.slice"
import {headersNamesDict, monthsOptions, yearsOptions} from "./NewOffersInfoConstants"
import NewOfferInfo from "components/NewDetailedOffersTable/NewOfferInfo/NewOfferInfo"
import {IAdditionalOfferInfo} from "types/offers"
import {v1} from "uuid"
import {
    fetchConstantsForCalculations,
    fetchProfitStatisticCalculations,
    updateConstantsForCalculations
} from "reduxFolder/slices/ordersSlice";
import {useDebounce} from "hooks/useDebounce";

const NewDetailedOffersTable: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const offersInfo = useSelector((state: RootStateType) => state.orders.profitStatisticCalculation);
    const generalOffersInfo = useSelector((state: RootStateType) => state.orders.generalProfitStatisticCalculation);
    const offersConstants = useSelector((state: RootStateType) => state.orders.constantsForStatisticCalculation);
    const offersInfoStatus = useSelector((state: RootStateType) => state.orders.profitStatisticCalculationLoadingStatus);
    const defaultYear = yearsOptions.find((y) => +moment().format("YYYY") === y.value)
    const defaultMonth = monthsOptions.find((m) => +moment().format("MM") === m.value)

    const [currentYear, setCurrentYear] = useState(defaultYear)
    const [currentMonth, setCurrentMonth] = useState(defaultMonth)


    const [refreshOffersInfo, setRefreshOffersInfo] = useState(false)

    useEffect(() => {
        if (!currentYear || !currentMonth) return
        const currentYearValue = currentYear.value.toString()
        const currentMonthValue =
            currentMonth.value < 10
                ? `0${currentMonth.value}`
                : currentMonth.value.toString()

        const startDate = moment(`${currentYearValue}-${currentMonthValue}-01`).format(
            "YYYY-MM-DD"
        )
        const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD")

        dispatch(fetchProfitStatisticCalculations({startDate, endDate}));
        dispatch(fetchConstantsForCalculations());
    }, [currentYear, currentMonth, refreshOffersInfo])

    const [netSalesConst, setNetSalesConst] = useState<number>();
    const debounceSalesConst = useDebounce<number>(netSalesConst as number, 1000)
    const [administrationConst, setAdministrationConst] = useState<number>();
    const debounceAdministrationConst = useDebounce<number>(administrationConst as number, 1000)
    const [acquisitionConst, setAcquisitionConst] = useState<number>();
    const debounceAcquisitionConst = useDebounce<number>(acquisitionConst as number, 1000)


    useEffect(() => {
        if (!!offersConstants) {
            setNetSalesConst(offersConstants.umsatz_netto_mindest);
            setAdministrationConst(offersConstants.administration);
            setAcquisitionConst(offersConstants.acquisition);
        }
    }, [offersConstants]);

    useEffect(() => {
        if (!!debounceSalesConst && !!debounceAdministrationConst && !!debounceAcquisitionConst
            && offersConstants
            && (debounceSalesConst !== offersConstants.umsatz_netto_mindest || debounceAdministrationConst !== offersConstants.administration
            || debounceAcquisitionConst !== offersConstants.acquisition)
        ) {
            dispatch(updateConstantsForCalculations({
                administration: administrationConst,
                acquisition: acquisitionConst,
                umsatz_netto_mindest: netSalesConst,
            })).then(() => {
                if (!currentYear || !currentMonth) return
                const currentYearValue = currentYear.value.toString()
                const currentMonthValue =
                    currentMonth.value < 10
                        ? `0${currentMonth.value}`
                        : currentMonth.value.toString()

                const startDate = moment(`${currentYearValue}-${currentMonthValue}-01`).format(
                    "YYYY-MM-DD"
                )
                const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD")
                dispatch(fetchProfitStatisticCalculations({startDate, endDate}));
            })
        }
    }, [debounceSalesConst, debounceAdministrationConst, debounceAcquisitionConst]);

    const Headers = Object.keys(headersNamesDict).map((h, i) => {
        const value = i === 2 ? netSalesConst : i === 4 ? administrationConst : acquisitionConst
        const changeValue = i === 2 ? setNetSalesConst : i === 4 ? setAdministrationConst : setAcquisitionConst
        // if (!netSalesConst || !administrationConst || !acquisitionConst) return null;
        return (i == 2 || i == 4 || i == 5) ?
            <th key={i} className={styles.constContainer}>
                <div className={styles.leftSide}>
                    {headersNamesDict[h as keyof typeof headersNamesDict]}
                </div>
                <div className={styles.rightSide}>
                    <input type="number" value={value} onChange={(e) => {
                        changeValue(parseInt(e.target.value));
                    }}
                           className={styles.constanst}/>
                </div>
            </th>
            :
            <th key={v1()}>{headersNamesDict[h as keyof typeof headersNamesDict]}</th>
    })

    const OffersInfo = () => {
        if (!!generalOffersInfo) {
            const sumOffer = {
                net_sales: generalOffersInfo.total_price,
                percentShare: generalOffersInfo.total_percentage_offer_for_all_sales,
                administration: generalOffersInfo.total_administration_per_month,
                acquisition: generalOffersInfo.total_Acquisition_per_month,
                total_working_hours: generalOffersInfo.total_working_time,
                external: generalOffersInfo.total_external_workers,
                work_hours_in_time: generalOffersInfo.total_working_time_external_worker,
                total_working_hours_externally: generalOffersInfo.total_external_working_time_per_worker,
                disposal_costs: generalOffersInfo.HV_zone_disposal_costs,
                quantity_clothes_boxes: generalOffersInfo.number_of_clothing_boxes,
                quantity_moving_boxes: generalOffersInfo.Number_of_moving_boxes,
                km: generalOffersInfo.km,
                transportation_cost: generalOffersInfo.total_transport_costs,
                total_cost: generalOffersInfo.total_costs,
                profit_removals: generalOffersInfo.total_profit,
                profit_percent: generalOffersInfo.profit_in_percents,
                total_profit: generalOffersInfo.total_profit,
                second_profit_percent: generalOffersInfo.profit_in_percents,
                global_sales_direction: generalOffersInfo.website_percentage,
            }


            return (
                <>
                    {<NewOfferInfo isSummary={true} offer={sumOffer} setRefreshOffersInfo={setRefreshOffersInfo}/>}
                    {
                        offersInfo.map((offer: Partial<NewDetailedOffersProps>) => (
                            <NewOfferInfo isSummary={false}
                                          key={offer.id}
                                          offer={offer}
                                          setRefreshOffersInfo={setRefreshOffersInfo}
                            />
                        ))
                    }
                </>
            )
        }
    }

    return (
        <div className={styles.wraper}>
            <h1>Angebote übersicht</h1>

            <div className={styles.table}>
                <header>{`${currentMonth?.label} ${currentYear?.label}`}</header>
                <table className={styles.infoTable}>
                    <thead>
                    <tr>
                        <th>{"Bearbeiten"}</th>
                        {Headers}
                    </tr>
                    </thead>
                    <tbody>{OffersInfo()}</tbody>
                </table>
            </div>

            <div className={styles.date}>
                <div className={styles.picker}>
                    <span className={classNames(styles.span, styles.active)}>{"Jahr"}</span>
                    <Select
                        styles={selectStyles}
                        options={yearsOptions}
                        defaultValue={defaultYear}
                        menuPlacement="auto"
                        isSearchable={false}
                        onChange={(e) => setCurrentYear(e!)}
                    />
                </div>
                <div className={styles.picker}>
                    <span className={classNames(styles.span, styles.active)}>{"Monat"}</span>
                    <Select
                        styles={selectStyles}
                        options={monthsOptions}
                        defaultValue={defaultMonth}
                        menuPlacement="auto"
                        isSearchable={false}
                        onChange={(e) => setCurrentMonth(e!)}
                    />
                </div>
            </div>
        </div>
    )
}

export default NewDetailedOffersTable
