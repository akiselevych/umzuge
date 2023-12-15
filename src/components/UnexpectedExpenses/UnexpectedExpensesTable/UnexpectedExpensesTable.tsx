//libs
import { FC, useMemo, useState } from "react";
//comppnents
import UnexpectedExpensesList from "components/UnexpectedExpenses/UnexpectedExpensesList/UnexpectedExpensesList";
import GeneralDataBlock from "../GeneralDataBlock/GeneralDataBlock";
//styles
import styles from "./UnexpectedExpensesTable.module.scss";
import classNames from "classnames";

const UnexpectedExpensesTable: FC = () => {
  const [dayValue, setDayValue] = useState<number>(0)
  const [weekValue, setWeekValue] = useState<number>(0)
  const [twoWeekValue, setTwoWeekValue] = useState<number>(0)
  const [threeWeekValue, setThreeWeekValue] = useState<number>(0)
  const [monthValue, setMonthValue] = useState<number>(0)

  const cells = useMemo(() => {
    return [
      {
        imageBlock: <div className={classNames(styles.imageBlock, styles.dayCallImage)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 2.66669H3.33333C2.59695 2.66669 2 3.26364 2 4.00002V13.3334C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3334V4.00002C14 3.26364 13.403 2.66669 12.6667 2.66669Z" stroke="#00487B" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6665 1.33331V3.99998" stroke="#00487B" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.3335 1.33331V3.99998" stroke="#00487B" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 6.66669H8H14" stroke="#00487B" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>,
        title: "Fällig heute",
        value: dayValue + " €"
      },
      {
        imageBlock: <div className={classNames(styles.imageBlock, styles.weekCellImage)}>
          7
        </div>,
        title: "Fällig in einer Woche",
        value: weekValue + " €"
      },
      {
        imageBlock: <div className={classNames(styles.imageBlock, styles.twoWeeksCellImage)}>
          14
        </div>,
        title: "Fällig in zwei Wochen",
        value: twoWeekValue + " €"
      },
      {
        imageBlock: <div className={classNames(styles.imageBlock, styles.threeWeeksCellImage)}>
          21
        </div>,
        title: "Fällig in drei Wochen",
        value: threeWeekValue + " €"
      },
      {
        imageBlock: <div className={classNames(styles.imageBlock, styles.monthCellImage)}>
          30
        </div>,
        title: "Fällig in einem Monat",
        value: monthValue + " €"
      }
    ]
  }, [dayValue, weekValue, twoWeekValue, threeWeekValue, monthValue])

  const setValues = ({ day, week, threeWeeks, twoWeeks, month }: {
    day: number,
    week: number,
    twoWeeks: number,
    threeWeeks: number,
    month: number
  }) => {
    setDayValue(day)
    setWeekValue(week)
    setTwoWeekValue(twoWeeks)
    setThreeWeekValue(threeWeeks)
    setMonthValue(month)
  }
  return (
    <div className={styles.table}>
      <GeneralDataBlock {...{ cells }} />
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderTitle}>
          Schritt 1: Daten erfassen
        </div>
        <div className={styles.tableHeaderTitle}>Schritt 2: Rech</div>
      </div>
      <UnexpectedExpensesList {...{ setValues }} />
    </div>
  );
};

export default UnexpectedExpensesTable;
