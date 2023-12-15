import { FC, useEffect, useRef, useState } from "react";
// Styles
import styles from "pages/Sidebar/Sidebar.module.scss";
// Icons
import logo from "assets/images/Logo.svg";
import chart from "assets/images/Chart.svg";
import pie from "assets/icons/Pie.svg";
import table from "assets/icons/Table.svg";
import bars from "assets/icons/Bars.svg";
// Components
import ModalWindow from "components/ModalWindow/ModalWindow";
import OrdersLineChart from "components/OrdersLineChart/OrdersLineChart";
import OrdersBarChart from "components/OrdersBarChart/OrdersBarChart";
import ExpensesTable from "components/ExpensesTable/ExpensesTable";
import UnexpectedExpensesTable from "components/UnexpectedExpenses/UnexpectedExpensesTable/UnexpectedExpensesTable";
import ProfitTable from "components/ProfitTable/ProfitTable";
import LeadsBarChart from "components/LeadsBarChart/LeadsBarChart";

import OrdersPieChart from "components/OrdersPieChart/OrdersPieChart";
//libs
import { useSelector } from "react-redux";
//types
import { RootStateType } from "types";
import classNames from "classnames";
import { useActions } from "hooks/useActions";
import { CurrentScreenType } from "types/calendar";
import SaleManInfo from "components/SaleManInfo/SaleManInfo";
import moment from "moment";
import companiesIcon from "assets/sidebarIcons/companies.svg";
import calendarIcon from "assets/sidebarIcons/calendar.svg";
import internalWorkersIcon from "assets/sidebarIcons/internalWorkers.svg";
import { dispositionScreensNamesDict } from "pages/Header/Header";
import DetailedOffersTable from "components/DetailedOffersTable/DetailedOffersTable";
import NewDetailedOffersTable from "components/NewDetailedOffersTable/NewDetailedOffersTable";

const dispositionScreensNames: { name: CurrentScreenType; svg: string }[] = [
  {
    name: "Calendar",
    svg: calendarIcon,
  },
  {
    name: "Internal workers",
    svg: internalWorkersIcon,
  },
  {
    name: "Suppliers",
    svg: companiesIcon,
  },
];

const Sidebar: FC = () => {
  const user = useSelector((state: RootStateType) => state.User.user);
  const currentWorkflow = useSelector(
    (state: RootStateType) => state.User.currentWorkflow
  );
  const currentDispositionScreen = useSelector(
    (state: RootStateType) => state.Calendar.currentScreen
  );
  const { setCurrentDispositionScreen, setCurrentDate } = useActions();

  const [content, setContent] = useState<"Buchhaltung" | "Charts">("Charts");
  const [isBonusPopUpOpened, setIsBonusPopUpOpened] = useState(false);

  const [isOrdersLineChartOpen, setIsOrdersLineChartOpen] = useState(false);
  const [isOrdersBarChartOpen, setIsOrdersBarChartOpen] = useState(false);
  const [isOrdersPieChartOpen, setIsOrdersPieChartOpen] = useState(false);
  const [isLeadsBarChartOpen, setIsLeadsBarChartOpen] = useState(false);

  const [isExpensesTableOpen, setIsExpensesTableOpen] = useState(false);
  const [isUnexpectedExpensesTableOpen, setIsUnexpectedExpensesTableOpen] =
    useState(false);
  const [isStatistikProfitTableOpen, setIsStatistikProfitTableOpen] = useState(false);
  const [isOffersInfoTableOpen, setIsOffersInfoTableOpen] = useState(false);

  const charts = [
    // {
    //   img: chart,
    //   onClick: () => setIsOrdersLineChartOpen(true),
    //   title: "Kundenanfragen",
    // },
    {
      img: table,
      onClick: () => setIsStatistikProfitTableOpen(true),
      title: "Akquise KPI",
    },
    {
      img: pie,
      onClick: () => setIsLeadsBarChartOpen(true),
      title: "Leads",
    },
    {
      img: bars,
      onClick: () => setIsOrdersBarChartOpen(true),
      title: "Angebote",
    },
    { img: pie, onClick: () => setIsOrdersPieChartOpen(true), title: "Umsatz" },
  ];
  const statTables = [
    {
      img: chart,
      onClick: () => setIsExpensesTableOpen(true),
      title: "Monatlich regelmäßige Ausgaben",
    },
    {
      img: bars,
      onClick: () => setIsUnexpectedExpensesTableOpen(true),
      title: "Unregelmäßige Ausgaben",
    },
    {
      img: pie,
      onClick: () => setIsOffersInfoTableOpen(true),
      title: "Gewinnrechner",
    },
  ];
  const chartCards = charts.map((c, i) => (
    <div key={i} className={styles.chartCard} onClick={c.onClick}>
      <img src={c.img} alt="chart" />
      {c.title}
    </div>
  ));
  const statTablesCards = statTables.map((c, i) => (
    <div key={i} className={styles.chartCard} onClick={c.onClick}>
      <img src={c.img} alt="chart" />
      {c.title}
    </div>
  ));

  const DispositionCards = dispositionScreensNames.map((n, i) => (
    <div
      key={i}
      className={
        n.name === currentDispositionScreen
          ? classNames(styles.chartCard, styles.active)
          : styles.chartCard
      }
      onClick={() => {
        setCurrentDispositionScreen(n.name);
        setCurrentDate(moment().format("YYYY-MM-DD"));
      }}
    >
      <img src={n.svg} />
      {dispositionScreensNamesDict[n.name]}
    </div>
  ));

  useEffect(() => {
    setContent("Charts");
  }, [currentWorkflow]);

  let Buttons = null;
  if (user?.role === "admin" && currentWorkflow === "Admin") {
    Buttons = (
      <>
        <button
          onClick={() => setContent("Charts")}
          className={content === "Charts" ? styles.active : ""}
        >
          Statistik
        </button>
        <button
          onClick={() => setContent("Buchhaltung")}
          className={content === "Buchhaltung" ? styles.active : ""}
        >
          Buchhaltung
        </button>
      </>
    );
  } else if (user?.role === "sale_man") {
    Buttons = (
      <button
        onClick={() => setIsBonusPopUpOpened(true)}
        className={styles.active}
      >
        Bonus
      </button>
    );
  } else {
    Buttons = <></>;
  }

  return (
    <section className={styles.sidebar}>
      <div className={styles.main}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.content}>
          <div
            className={
              content === "Charts"
                ? styles.charts
                : classNames(styles.charts, styles.hidden)
            }
          >
            {currentWorkflow === "Disposition" ? DispositionCards : chartCards}
          </div>
          <div
            className={
              content === "Buchhaltung"
                ? styles.charts
                : classNames(styles.charts, styles.hidden)
            }
          >
            {statTablesCards}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>{Buttons}</div>
      {user && user.role === "sale_man" && (
        <ModalWindow
          size="large"
          withLogo={true}
          isModaltOpen={isBonusPopUpOpened}
          setIsModaltOpen={setIsBonusPopUpOpened}
        >
          <SaleManInfo />
        </ModalWindow>
      )}

      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsOrdersLineChartOpen}
        isModaltOpen={isOrdersLineChartOpen}
      >
        <OrdersLineChart />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsOrdersBarChartOpen}
        isModaltOpen={isOrdersBarChartOpen}
      >
        <OrdersBarChart />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsLeadsBarChartOpen}
        isModaltOpen={isLeadsBarChartOpen}
      >
        <LeadsBarChart />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsOrdersPieChartOpen}
        isModaltOpen={isOrdersPieChartOpen}
      >
        <OrdersPieChart />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsExpensesTableOpen}
        isModaltOpen={isExpensesTableOpen}
      >
        <ExpensesTable />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsUnexpectedExpensesTableOpen}
        isModaltOpen={isUnexpectedExpensesTableOpen}
      >
        <UnexpectedExpensesTable />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsStatistikProfitTableOpen}
        isModaltOpen={isStatistikProfitTableOpen}
      >
        <ProfitTable />
      </ModalWindow>
      <ModalWindow
        size="large"
        withLogo={true}
        setIsModaltOpen={setIsOffersInfoTableOpen}
        isModaltOpen={isOffersInfoTableOpen}
      >
        <NewDetailedOffersTable />
      </ModalWindow>
    </section>
  );
};

export default Sidebar;
