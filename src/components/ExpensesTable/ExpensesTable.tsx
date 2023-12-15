//libs
import { FC } from "react";
//components
import ExpensesList from "components/ExpensesList/ExpensesList";
//styles
import styles from "./ExpensesTable.module.scss";
//types
// import { ExpensesTableProps } from "types/index";

const ExpensesTable: FC = () => {
    return (
        <div
            className={styles.table}
        // style={{ display: isExpensesTableOpen ? "block" : "none" }}
        >
            <div className={styles.tableHeader}>
                <div className={styles.tableHeaderTitle}>
                    Monatliche Wiederkehrende Ausgaben SIEBEN Umzüge GmbH
                </div>
            </div>
            <ExpensesList />
        </div>
    );
};

export default ExpensesTable;
