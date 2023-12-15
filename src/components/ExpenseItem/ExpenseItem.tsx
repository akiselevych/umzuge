//libs
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//hooks
import { useDebounce } from "hooks/useDebounce";
//redux
import { changeExpense } from "reduxFolder/slices/expensesSlice";
//styles
import styles from "./ExpenseItem.module.scss";
//types
import { AppDispatch, ExpenseType } from "types/index";

const ListItem: FC<ExpenseType> = ({ name, expense, id }) => {
    const [inputName, setInputName] = useState<string>(name);
    const [inputExpense, setInputExpense] = useState<string | number>(expense);
    const debouncedName = useDebounce<string>(inputName, 200);
    const debounceExpense = useDebounce<string>(inputExpense.toString(), 200);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (debounceExpense !== expense.toString() || debouncedName !== name) {
            const changedExpense: ExpenseType = {
                name: debouncedName,
                expense: parseFloat(debounceExpense),
                id,
            };
            dispatch(changeExpense(changedExpense));
        }
        // eslint-disable-next-line
    }, [debounceExpense, debouncedName]);

    return (
        <li className={styles.tableListItem}>
            <input
                required
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className={styles.tableListCell}
            />
            <input
                type="text"
                onChange={(e) => setInputExpense(e.target.value.replace(/,/g, '.').replace(/[^\d.,]/g, ''))}
                value={`${inputExpense}€`.replace(/\./g, ',')}
                className={styles.tableListCell}
            />
        </li>
    );
};

export default ListItem;
