import { Dispatch, FC, useState, useRef, useEffect } from "react"
import { serverDomain } from "services/API"
import { IAdditionalOfferInfo } from "types/offers"
import defaultPhoto from "assets/images/person.svg"
import styles from "./OfferInfo.module.scss"
import editIcon from "assets/icons/pencil.svg"
import submitIcon from "assets/icons/check-mark.svg"
import { useDispatch } from "react-redux"
import {AppDispatch, NewDetailedOffersProps} from "types"
import { editOffersAdditionalInfo } from "reduxFolder/slices/Table.slice"
import {
    fetchProfitStatistic,
    fetchProfitStatisticCalculations,
    updateProfitStatisticCalculations
} from "reduxFolder/slices/ordersSlice";

type PropsType = {
    offer: Partial<NewDetailedOffersProps>
    setRefreshOffersInfo: Dispatch<React.SetStateAction<boolean>>,
    isSummary: boolean
}

const NewOfferInfo: FC<PropsType> = ({ offer, setRefreshOffersInfo, isSummary }) => {
    const dispatch = useDispatch<AppDispatch>()

    const [isEditing, setIsEditing] = useState(false)

    const [disposalCost, setDisposalCost] = useState<number | undefined>(offer.disposal_costs)
    const [clothesBoxes, setClothesBoxes] = useState<number | undefined>(offer.quantity_clothes_boxes)
    const [movingBoxes, setMovingBoxes] = useState<number | undefined>(offer.quantity_moving_boxes)
    const [transportCost, setTransportCost] = useState<number | undefined>(offer.transportation_cost)


    async function handleSubmit() {
        const data = {
            HV_zone_disposal_costs: disposalCost as number,
            Number_of_boxes: clothesBoxes as number,
            Number_of_moving_boxes: movingBoxes as number,
            transport_costs: transportCost as number
        }
        await dispatch(updateProfitStatisticCalculations({ id: offer.id as number, data: data,  }))
        setIsEditing(false)
        setRefreshOffersInfo((prev) => !prev)
    }

    // useEffect(() => {
    //     if (isEditing) {
    //         focusedInput.current?.focus()
    //     }
    // }, [isEditing])

    return (
        <tr className={`${isSummary && styles.summary}`}>
            <td >
                <div className={styles.cell} style={{visibility: isSummary ? "hidden" : "visible"}}>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}>
                            <img src={editIcon} />
                        </button>
                    ) : (
                        <button onClick={() => handleSubmit()}>
                            <img src={submitIcon} />
                        </button>
                    )}
                </div>
            </td>
            <td>
                <div className={styles.cell}>
                    {!!offer.date ? (
                        <>
                            {`${offer.date}`}
                        </>
                    ) : (
                        "-"
                    )}
                </div>
            </td>
            <td>
                <div className={styles.cell}>
                    {!!offer.name ? (
                        <>
                            {`${offer.name}`}
                        </>
                    ) : (
                        "-"
                    )}
                </div>
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.net_sales?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.percentShare?.toFixed(2)}%`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.administration?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.acquisition?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.carrier ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.working_hours ? `${offer.working_hours}`.replace(/\./g, ',') : "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.total_working_hours}`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.external ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.work_hours_in_time ? `${offer.work_hours_in_time}`.replace(/\./g, ',') : "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.total_working_hours_externally}`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Number"
                        step={0.01}
                        type="number" value={disposalCost} onChange={(e) => setDisposalCost(parseFloat(e.target.value))} />
                ) : (
                    disposalCost ? `${disposalCost?.toFixed(2)}€`.replace(/\./g, ',') : "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Number"
                        type="number" value={clothesBoxes} onChange={(e) => setClothesBoxes(parseInt(e.target.value))} />
                ) : (
                    clothesBoxes ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Number"
                        type="number" value={movingBoxes} onChange={(e) => setMovingBoxes(parseInt(e.target.value))} />
                ) : (
                    movingBoxes ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.km ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Number"
                        type="number" value={transportCost} onChange={(e) => setTransportCost(parseFloat(e.target.value))} />
                ) : (
                    transportCost ? `${transportCost?.toFixed(2)}€`.replace(/\./g, ',') : "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.total_cost?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.profit_removals?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.profit_percent?.toFixed(2)}%`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.total_profit?.toFixed(2)}€`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    `${offer.second_profit_percent?.toFixed(2)}%`.replace(/\./g, ',') ?? "-"
                }
            </td>
            <td className={styles.tdWithInput}>
                {
                    offer.global_sales_direction ? `${offer.global_sales_direction?.toFixed(2)}%`.replace(/\./g, ',') :  "-"
                }
            </td>
        </tr>
    )
}

export default NewOfferInfo
