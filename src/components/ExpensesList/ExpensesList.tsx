//libs
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
//components
import ListItem from "components/ExpenseItem/ExpenseItem";
import AddExpenseForm from "components/AddExpenseForm/AddExpenseForm";
//redux
import { fetchExpenses } from "reduxFolder/slices/expensesSlice";
//styles
import styles from "./ExpensesList.module.scss";
import plus from "assets/icons/plus.svg";
//types
import { AppDispatch, RootStateType, ExpenseType } from "types";

const ExpensesList = () => {
    const expenses = useSelector(
        (state: RootStateType) => state.expenses.expenses);
    const expensesLoadingStatus = useSelector(
        (state: RootStateType) => state.expenses.expensesLoadingStatus
    );
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchExpenses());
        // eslint-disable-next-line
    }, []);

    const totalExpenses = useMemo(() => {
        const sum = expenses.reduce((acc, expense) => acc + expense.expense, 0);
        return Math.round(sum * 10) / 10;
    }, [expenses]);

    const loading = expensesLoadingStatus === "loading" ? "loading..." : null;
    const error = expensesLoadingStatus === "error" ? "fehler..." : null;
    const content =
        expensesLoadingStatus === "idle" ? (
            <>
                <ul className={styles.tableList}>
                    <li className={styles.tableListItem}>
                        <p
                            className={`${styles.cellTitle} ${styles.tableListCell}`}
                        >
                            Namen
                        </p>
                        <p
                            className={`${styles.cellTitle} ${styles.tableListCell}`}
                        >
                            Betrag
                        </p>
                    </li>
                    {expenses.map((expense: ExpenseType) => (
                        <ListItem
                            name={expense.name}
                            expense={expense.expense}
                            id={expense.id}
                            key={expense.id}
                        />
                    ))}
                    <li className={styles.tableListItem}>
                        <p className={`${styles.tableListCell}`}>Total</p>
                        <p className={`${styles.tableListCell}`}>
                            {totalExpenses}€
                        </p>
                    </li>
                    <button
                        className={styles.tableListAddButton}
                        onClick={() => setIsFormOpen((prev) => !prev)}
                    >
                        <img
                            style={{
                                transform: isFormOpen
                                    ? "rotate(45deg)"
                                    : "none",
                            }}
                            src={plus}
                            alt="add new expense"
                        />
                    </button>
                </ul>
                <AddExpenseForm
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                />
            </>
        ) : null;

    return (
        <>
            {loading}
            {error}
            {content}
        </>
    );
};

export default ExpensesList;
