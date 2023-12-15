//libs
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//hooks
import { useDebounce } from "hooks/useDebounce";
//redux
import { changeUnxpectedExpensesData } from "reduxFolder/slices/unexpectedExpensesSlice";
//styles
import styles from "./UnexpectedExpensesItem.module.scss";
//types
import { AppDispatch, unexpectedExpensesItemType } from "types/index";
//images
import deleteIcon from "assets/icons/trash_can.svg"
import classNames from "classnames";

interface Props extends unexpectedExpensesItemType {
  onDelete: (arf: string | number) => void;
}
const UnexpectedExpensesItem: FC<Props> = ({
  amount,
  dateReceived,
  dueDate,
  invoice,
  invoiceArchived,
  invoiceAudited,
  invoicingParty,
  id,
  onDelete
}) => {
  const [dateReceivedInput, setDateReceivedInput] = useState<string>(dateReceived);
  const [amountInput, setAmountInput] = useState<string>(amount);
  const [dueDateInput, setDueDateInput] = useState<string>(dueDate);
  const [invoiceAuditedInput, setInvoiceAuditedInput] = useState<boolean>(invoiceAudited);
  const [invoiceArchivedInput, setInvoiceArchivedInput] = useState<boolean>(invoiceArchived);
  const [invoiceInput, setInvoiceInput] =
    useState<string>(invoice);
  const [invoicingPartyInput, setInvoicingPartyInput] = useState<string>(invoicingParty);

  const dateReceivedInputDebounce = useDebounce<string>(dateReceivedInput, 300);
  const invoicingPartyInputDebounce = useDebounce<string>(invoicingPartyInput, 300);
  const amountInputDebounce = useDebounce<string>(amountInput, 300);
  const dueDateInputDebounce = useDebounce<string>(dueDateInput, 300);
  const invoiceInputDebounce = useDebounce<string>(
    invoiceInput,
    300
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      dateReceivedInputDebounce !== dateReceived ||
      invoicingPartyInputDebounce !== invoicingParty ||
      amountInputDebounce !== amount ||
      dueDateInputDebounce !== dueDate ||
      invoiceInputDebounce !== invoice ||
      invoiceArchivedInput !== invoiceArchived ||
      invoiceAuditedInput !== invoiceAudited
    ) {
      const changedIncomingInvoicesItem: unexpectedExpensesItemType = {
        invoicingParty: invoicingPartyInputDebounce,
        id,
        invoice: invoiceInputDebounce,
        dateReceived: dateReceivedInputDebounce,
        amount: amountInputDebounce,
        dueDate: dueDateInputDebounce,
        invoiceAudited: invoiceAuditedInput,
        invoiceArchived: invoiceArchivedInput,
      };
      dispatch(changeUnxpectedExpensesData(changedIncomingInvoicesItem));
    }
    // eslint-disable-next-line
  }, [
    dateReceivedInputDebounce,
    invoicingPartyInputDebounce,
    amountInputDebounce,
    dueDateInputDebounce,
    invoiceInputDebounce,
    invoiceArchivedInput,
    invoiceAuditedInput,
  ]);

  return (
    <li className={styles.tableListItem}>
      <input
        value={invoicingPartyInput}
        onChange={(e) => setInvoicingPartyInput(e.target.value)}
        className={styles.tableListCell}
      />
      <input
        value={invoiceInput}
        onChange={(e) => setInvoiceInput(e.target.value)}
        className={styles.tableListCell}
      />
      <input
        value={dateReceivedInput}
        onChange={(e) => setDateReceivedInput(e.target.value)}
        className={styles.tableListCell}
      />
      <input
        value={`${amountInput}€`.replace(/\./g, ',')}
        onChange={(e) => setAmountInput(e.target.value.replace(/,/g, '.').replace(/[^\d.,]/g, ''))}
        className={styles.tableListCell}
      />
      <input
        value={dueDateInput}
        onChange={(e) => setDueDateInput(e.target.value)}
        className={styles.tableListCell}
      />
      <select
        value={invoiceAuditedInput ? "Ja" : "Nein"}
        onChange={(e) => setInvoiceAuditedInput(e.target.value === "Ja")}
        className={styles.tableListCell}
      >
        <option value="Ja">Ja</option>
        <option value="Nein">Nein</option>
      </select>
      <select
        value={invoiceArchivedInput ? "Ja" : "Nein"}
        onChange={(e) => setInvoiceArchivedInput(e.target.value === "Ja")}
        className={styles.tableListCell}
      >
        <option value="Ja">Ja</option>
        <option value="Nein">Nein</option>
      </select>
      <div
        onClick={() => onDelete(id)}
        className={classNames(styles.tableListCell, styles.deleteContainer)}
      >
        <img className={styles.delete} src={deleteIcon} alt="delete" />
      </div>
    </li>
  );
};

export default UnexpectedExpensesItem;
