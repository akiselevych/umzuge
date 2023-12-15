//libs
import { FC } from "react"
//components
import ProfitCell from "components/ProfitCell/ProfitCell"
//redux
//styles
import styles from "./ProfitList.module.scss"
//types
import { StatistikProfitListProps } from "types/index"
import classNames from "classnames"


const ProfitList: FC<StatistikProfitListProps> = ({ data, title }) => {
    const calcTotal = (key: keyof typeof data[0]) => {
        return data.reduce((acc, obj) => typeof obj[key] === 'number' ? acc + +obj[key] : acc, 0);
    };
    return (
        <div className={styles.wrapper}>
            <p className={styles.header}>{title || "N/A"}</p>
            <ul className={styles.list}>
                <li className={classNames(styles.listItem, styles.listHeaderItem)}>
                    <ProfitCell className="title" value="Woche" />
                    <ProfitCell className="title" value="Leads erhalten" />
                    <ProfitCell className="title" value="Anz. Angebote" />
                    <ProfitCell className="title" value="Anz. Abschlüsse" />
                    <ProfitCell className="title" value="Koversationsrate" />
                    <ProfitCell className="title" value="Erzielter Umsatz €" />
                    <ProfitCell className="title" value="⌀ Umsatz pro Abschluss €" />
                    <ProfitCell className="title" value="⌀ Kosten der Leads €" />
                    <ProfitCell className="title" value="⌀ Kosten pro Abschluss €" />
                    <ProfitCell className="title" value="⌀ Kosten pro Umsatz €" />
                    <ProfitCell className="title" value="Gehalt €" />
                    <ProfitCell className="title" value="Gehalt provision €" />
                    <ProfitCell className="title" value="Gehalt gesamt €" />
                    <ProfitCell className="title" value="Vorraussichtliches Gehalt im Monat €" />
                </li>
                {data.map((week, i) => {
                    return <li className={styles.listItem} key={i}>
                        <ProfitCell value={`Woche ${i + 1}`} />
                        <ProfitCell value={week.leads_count} />
                        <ProfitCell value={week.orders_count} />
                        <ProfitCell value={week.count_finished_offers} />
                        <ProfitCell value={week.conversion_rate} />
                        <ProfitCell value={`${week.total_price.toFixed(2)} €`} />
                        <ProfitCell value={`${week.revenue_per_finished_order.toFixed(2)} €`} />
                        <ProfitCell value={`${week.cost_per_lead.toFixed(2)} €`} />
                        <ProfitCell value={`${week.cost_per_finished_lead.toFixed(2)} €`} />
                        <ProfitCell value={`${week.cost_per_revenue.toFixed(2)} €`} />
                        <ProfitCell value={`${week.salary.toFixed(2)} €`} />
                        <ProfitCell value={`${week.estimated_salary.toFixed(2)} €`} />
                        <ProfitCell value={`${parseFloat(week.total_salary as string).toFixed(2)} €`} />
                        <ProfitCell value={`${parseFloat(week.expected_salary_in_month as string).toFixed(2)} €`} />
                    </li>
                })}
                <li className={styles.listItem}>
                    <ProfitCell value="Summe:" />
                    <ProfitCell value={!Number.isNaN(calcTotal("leads_count")) ? calcTotal("leads_count") : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("orders_count")) ? calcTotal("orders_count") : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("count_finished_offers")) ? calcTotal("count_finished_offers") : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("conversion_rate")) ? calcTotal("conversion_rate") : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("total_price")) ? `${calcTotal("total_price").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("revenue_per_finished_order")) ? `${calcTotal("revenue_per_finished_order").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("cost_per_lead")) ? `${calcTotal("cost_per_lead").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("cost_per_finished_lead")) ? `${calcTotal("cost_per_finished_lead").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("cost_per_revenue")) ? `${calcTotal("cost_per_revenue").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("salary")) ? `${calcTotal("salary").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("estimated_salary")) ? `${calcTotal("estimated_salary").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("total_salary")) ? `${calcTotal("total_salary").toFixed(2)} €` : ""} />
                    <ProfitCell value={!Number.isNaN(calcTotal("expected_salary_in_month")) ? `${calcTotal("expected_salary_in_month").toFixed(2)} €` : ""} />
                </li>
            </ul>
        </div>
    )
}

export default ProfitList

