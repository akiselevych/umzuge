//libs
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form"
//redux
import { addExpense } from "reduxFolder/slices/unexpectedExpensesSlice";
//styles
import styles from "./AddUnexpectedExpense.module.scss";
//types
import { AddExpenseFormProps, AppDispatch, RootStateType } from "types/index";


type Inputs = {
  amount: string,
  dateReceived: string,
  dueDate: string,
  invoice: string,
  invoiceArchived: "Ja" | "Nein",
  invoiceAudited: "Ja" | "Nein",
  invoicingParty: string,
}

const AddUnexpectedExpense: FC<AddExpenseFormProps> = ({
  isFormOpen,
  setIsFormOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>()
  const loadingStatus = useSelector((state: RootStateType) => state.unexpectedExpenses.setUnexpectedExpensesLoadingStatus)
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(addExpense({
      ...data,
      invoiceArchived: data.invoiceArchived === "Ja",
      invoiceAudited: data.invoiceAudited === "Ja",
    })).then(() => {
      reset()
      setIsFormOpen(false)
    })
  }

  useEffect(() => {
    clearErrors()
    //eslint-disable-next-line
  }, [])
  return (
    <>
      <form
        className={styles.expenseForm}
        style={{ display: isFormOpen ? "flex" : "none" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          placeholder="Rechnungssteller"
          type="string"
          className={styles.expenseFormInput}
          {...register("invoicingParty", { required: true })}
        />
        <input
          placeholder="Rechnungsname"
          type="string"
          className={styles.expenseFormInput}
          {...register("invoice", { required: true })}
        />
        <input
          placeholder="Eingangsdatum"
          type="string"
          className={styles.expenseFormInput}
          {...register("dateReceived", { required: true })}
        />
        <input
          step={0.01}
          placeholder="Rechnungsbetrag"
          type="number"
          className={styles.expenseFormInput}
          {...register("amount", { required: true })}
        />
        <input
          placeholder="Fälligkeitsdatum"
          type="string"
          className={styles.expenseFormInput}
          {...register("dueDate", { required: true })}
        />
        <select
          className={styles.expenseFormInput}
          {...register("invoiceAudited", { required: true })}>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>
        <select
          className={styles.expenseFormInput}
          {...register("invoiceArchived", { required: true })}>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>
        <button disabled={loadingStatus == 'loading'} className={styles.submibtn} type="submit">{loadingStatus === 'loading' ? "loading..." : "OK"}</button>
      </form>
      <div style={{ display: isFormOpen ? "flex" : "none" }} className={styles.errors}>
        {loadingStatus === "error" && <span>Etwas war falsch</span>}
        {errors.invoicingParty && <span>Rechnungssteller: Feld muss ausgefüllt werden</span>}
        {errors.invoice && <span>Rechnungsname: Feld muss ausgefüllt werden</span>}
        {errors.dateReceived && <span>Eingangsdatum: Feld muss ausgefüllt werden</span>}
        {errors.dateReceived && <span>Rechnungsbetrag: Feld muss ausgefüllt werden</span>}
        {errors.amount && <span>Rechnungsbetrag: Feld muss ausgefüllt werden</span>}
      </div>
    </>
  );
};

export default AddUnexpectedExpense;
