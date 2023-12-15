//libs
import { FC, useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
//redux
import { addExpense } from "reduxFolder/slices/expensesSlice";
//hooks
import { useDebounce } from "hooks/useDebounce";
//styles
import styles from "./AddExpenseForm.module.scss";
//types
import { AddExpenseFormProps, AppDispatch, ExpenseType } from "types/index";

const AddExpenseForm: FC<AddExpenseFormProps> = ({
    isFormOpen,
    setIsFormOpen,
}) => {
    const [inputName, setInputName] = useState<string>("");
    const [inputExpense, setInputExpense] = useState<string>("");
    const debouncedName = useDebounce<string>(inputName, 200);
    const debounceExpense = useDebounce<string>(inputExpense, 200);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const changedExpense: ExpenseType = {
            name: debouncedName,
            expense: +debounceExpense,
            id: nanoid(),
        };
        dispatch(addExpense(changedExpense));
        setInputExpense("");
        setInputName("");
        setIsFormOpen(false);
    };
    return (
        <form
            className={styles.expenseForm}
            style={{ display: isFormOpen ? "flex" : "none" }}
            onSubmit={onSubmit}
        >
            <input
                placeholder="Namen"
                required
                type="text"
                className={styles.expenseFormInput}
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
            />
            <input
                placeholder="Betrag"
                required
                type="text"
                className={styles.expenseFormInput}
                onChange={(e) => setInputExpense(e.target.value.replace(/,/g, '.').replace(/[^\d.,]/g, ''))}
                value={`${inputExpense}€`.replace(/\./g, ',')}
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddExpenseForm;
