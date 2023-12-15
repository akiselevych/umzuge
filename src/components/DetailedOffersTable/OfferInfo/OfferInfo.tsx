import { Dispatch, FC, useState, useRef, useEffect } from "react"
import { serverDomain } from "services/API"
import { IAdditionalOfferInfo } from "types/offers"
import defaultPhoto from "assets/images/person.svg"
import styles from "./OfferInfo.module.scss"
import editIcon from "assets/icons/pencil.svg"
import submitIcon from "assets/icons/check-mark.svg"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types"
import { editOffersAdditionalInfo } from "reduxFolder/slices/Table.slice"

type PropsType = {
    offer: IAdditionalOfferInfo
    setRefreshOffersInfo: Dispatch<React.SetStateAction<boolean>>
}

const OfferInfo: FC<PropsType> = ({ offer, setRefreshOffersInfo }) => {
    const dispatch = useDispatch<AppDispatch>()

    const [isEditing, setIsEditing] = useState(false)

    const [management, setManagement] = useState(offer.management ?? "")
    const [acquisition, setAcquisition] = useState(offer.acquisition ?? "")
    const [netSales, setNetSales] = useState(offer.offer_statistic__net_sales ?? "")
    const [acquisitionCosts, setAcquisitionCosts] = useState(
        offer.offer_statistic__acquisition_costs ?? ""
    )
    const [HVZoneDisposalCosts, setHVZoneDisposalCosts] = useState(
        offer.offer_statistic__HV_zone_disposal_costs ?? ""
    )
    const [numberOfBoxes, setNumberOfBoxes] = useState(
        offer.offer_statistic__Number_of_boxes ?? ""
    )
    const [numberOfMovingBoxes, setNumberOfMovingBoxes] = useState(
        offer.offer_statistic__Number_of_moving_boxes ?? ""
    )
    const [km, setKm] = useState(offer.offer_statistic__km ?? "")
    const [transportCosts, setTransportCosts] = useState(offer.transport_cost ?? "")

    const focusedInput = useRef<HTMLInputElement>(null)

    async function handleSubmit() {
        const data = {
            management_in_month: management,
            acquisition_in_month: acquisition,
            net_sales: netSales,
            acquisition_costs: acquisitionCosts,
            HV_zone_disposal_costs: HVZoneDisposalCosts,
            Number_of_boxes: numberOfBoxes,
            Number_of_moving_boxes: numberOfMovingBoxes,
            km: km,
            transport_costs: transportCosts,
        }
        await dispatch(editOffersAdditionalInfo({ id: offer.offer_statistic_id, data }))
        setIsEditing(false)
        setRefreshOffersInfo((prev) => !prev)
    }

    useEffect(() => {
        if (isEditing) {
            focusedInput.current?.focus()
        }
    }, [isEditing])
    return (
        <tr >
            <td >
                <div className={styles.cell}>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}>
                            <img src={editIcon} />
                        </button>
                    ) : (
                        <button onClick={handleSubmit}>
                            <img src={submitIcon} />
                        </button>
                    )}
                </div>
            </td>
            <td>
                <div className={styles.cell}>
                    {offer.sale_man ? (
                        <>
                            <img
                                src={
                                    offer.sale_man?.image_path
                                        ? serverDomain + offer.sale_man.image_path
                                        : defaultPhoto
                                }
                            />
                            {`${offer.sale_man?.first_name} ${offer.sale_man?.last_name}`}
                        </>
                    ) : (
                        "-"
                    )}
                </div>
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        ref={focusedInput}
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={netSales}
                        onChange={(e) => setNetSales(e.target.value)}
                    />
                ) : (
                    offer.offer_statistic__net_sales ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={HVZoneDisposalCosts}
                        onChange={(e) => setHVZoneDisposalCosts(e.target.value)}
                    />
                ) : (
                    offer.offer_statistic__HV_zone_disposal_costs ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={numberOfBoxes}
                        onChange={(e) => setNumberOfBoxes(e.target.value)}
                    />
                ) : (
                    offer.offer_statistic__Number_of_boxes ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={numberOfMovingBoxes}
                        onChange={(e) => setNumberOfMovingBoxes(e.target.value)}
                    />
                ) : (
                    offer.offer_statistic__Number_of_moving_boxes ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text" value={km} onChange={(e) => setKm(e.target.value)} />
                ) : (
                    offer.offer_statistic__km ?? "-"
                )}
            </td>
            <td>{offer.offer_statistic_id ?? "-"}</td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={acquisitionCosts}
                        onChange={(e) => setAcquisitionCosts(e.target.value)}
                    />
                ) : (
                    offer.offer_statistic__acquisition_costs ?? "-"
                )}
            </td>
            <td>{offer.employee_turnover ?? "-"}</td>
            <td>{offer.employee_turnover_per_total ?? "-"}</td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={acquisition}
                        onChange={(e) => setAcquisition(e.target.value)}
                    />
                ) : (
                    offer.acquisition ?? "-"
                )}
            </td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput}
                        placeholder="Text"
                        type="text"
                        value={management}
                        onChange={(e) => setManagement(e.target.value)}
                    />
                ) : (
                    offer.management ?? "-"
                )}
            </td>
            <td>{offer.couriers_count ?? "-"}</td>
            <td>{offer.count_couriers_hours ?? "-"}</td>
            <td>{offer.count_external_workers ?? "-"}</td>
            <td>{offer.count_external_workers_hours ?? "-"}</td>
            <td className={styles.tdWithInput}>
                {isEditing ? (
                    <input
                        className={styles.editInput} placeholder="Text"

                        type="text"
                        value={transportCosts}
                        onChange={(e) => setTransportCosts(e.target.value)}
                    />
                ) : (
                    offer.transport_cost ?? "-"
                )}
            </td>
            <td>{offer.total_costs ?? "-"}</td>
            <td>{offer.profit_removals}</td>
            <td>{offer.profit_removals_per_total ?? "-"}</td>
        </tr>
    )
}

export default OfferInfo
