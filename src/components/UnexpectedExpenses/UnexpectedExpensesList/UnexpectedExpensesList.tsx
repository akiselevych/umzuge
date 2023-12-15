//libs
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment'
//components
import UnexpectedExpensesItem from "components/UnexpectedExpenses/UnexpectedExpensesItem/UnexpectedExpensesItem";
import AddUnexpectedExpense from "../AddUnexpectedExpense/AddUnexpectedExpense";
//redux
import { fetchUnxpectedExpensesData, deleteExpense } from "reduxFolder/slices/unexpectedExpensesSlice";
import { selectSortedUnexpectedExpenses } from "reduxFolder/selectors";
//styles
import styles from "./UnexpectedExpensesList.module.scss";
//types
import { RootStateType, AppDispatch, unexpectedExpensesItemType } from "types/index";
//iamges
import plus from "assets/icons/plus.svg";

const CellTitleNames = [
  "Rechnungssteller",
  "Rechnungsname",
  "Eingangsdatum",
  "Rechnungsbetrag",
  "Fälligkeitsdatum",
  "Rechnung geprüft",
  "Rechnung archiviert",
];

type Props = {
  setValues: (obj: {
    day: number,
    week: number,
    twoWeeks: number,
    threeWeeks: number,
    month: number
  }) => void;
}

const UnexpectedExpensesList = ({ setValues }: Props) => {
  const incomingInvoices = useSelector(selectSortedUnexpectedExpenses);
  const response = useSelector(
    (state: RootStateType) => state.unexpectedExpenses.fetchUnxpectedExpensesResponse
  );
  const incomingInvoicesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.unexpectedExpenses.unexpectedExpensesLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);



  useEffect(() => {
    if (!response && !incomingInvoices.length) {
      dispatch(fetchUnxpectedExpensesData());
    } else if (response && response.next) {
      dispatch(fetchUnxpectedExpensesData(response.next));
    }
    // eslint-disable-next-line
  }, [incomingInvoices]);


  useEffect(() => {
    const { day, week, twoWeeks, threeWeeks, month } = categorizeExpenses(incomingInvoices);
    setValues({ day, week, twoWeeks, threeWeeks, month })
    // eslint-disable-next-line
  }, [incomingInvoices])

  const onDelete = (id: string | number) => dispatch(deleteExpense({ id }));



  const loading =
    incomingInvoicesLoadingStatus === "loading" ? "loading..." : null;
  const error = incomingInvoicesLoadingStatus === "error" ? "error..." : null;
  const content =
    incomingInvoicesLoadingStatus === "idle" ? (
      <>
        <ul className={styles.tableList}>
          <li className={styles.tableListItem}>
            {CellTitleNames.map((name, i) => (
              <p
                key={i}
                className={`${styles.cellTitle} ${styles.tableListCell}`}
              >
                {name}
              </p>
            ))}
          </li>
          {!incomingInvoices.length && <p className={styles.emptyList}>No data</p>}
          {incomingInvoices.map(
            ({
              amount,
              dateReceived,
              dueDate,
              invoice,
              invoiceArchived,
              invoiceAudited,
              invoicingParty,
              id
            }) => {
              return (
                <UnexpectedExpensesItem
                  {...{
                    id,
                    dateReceived,
                    amount,
                    dueDate,
                    invoicingParty,
                    invoiceArchived,
                    invoiceAudited,
                    invoice,
                    onDelete
                  }}
                  key={id}
                />
              );
            }
          )}
        </ul>
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
        {isFormOpen && <AddUnexpectedExpense
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
        />}
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

function categorizeExpenses(expenses: unexpectedExpensesItemType[]) {
  const today = moment().startOf('day'); // Today's date at the start of the day
  const result = {
    day: 0,
    week: 0,
    twoWeeks: 0,
    threeWeeks: 0,
    month: 0
  };

  expenses.forEach(expense => {
    const dueDate = moment(expense.dueDate);
    const diffDays = dueDate.diff(today, 'days'); // Difference in days
    const amount = parseFloat(expense.amount) || 0;
    if (diffDays >= 0) {
      if (diffDays < 1) result.day += amount; // Today
      if (diffDays < 7) result.week += amount; // Next 7 days
      if (diffDays < 14) result.twoWeeks += amount; // Next 14 days
      if (diffDays < 21) result.threeWeeks += amount; // Next 21 days
      if (diffDays < 30) result.month += amount; // Next 30 days
    }
  });

  return result;
}

export default UnexpectedExpensesList;
