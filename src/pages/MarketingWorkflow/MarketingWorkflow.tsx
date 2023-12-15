import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "components/Marketing/Calendar";
import MainHeader from "components/Marketing/MainHeader";
import styles from "./MarketingWorkflow.module.scss";
import { TabNameType } from "components/Marketing/Calendar/Types/TabNameType";
import Website from "components/Marketing/Website";
import Blog from "components/Marketing/Blog/Blog";
import Vacancies from "components/Marketing/Vacancies";
import Employees from "components/Marketing/Employees";
import PhotoReview from "components/Marketing/PhotoReview";
import Partners from "components/Marketing/Partners";
import ClientReviews from "components/Marketing/ClientReviews";
import Faq from "components/Marketing/Faq";
import Cities from "components/Marketing/Cities";

const tabs: Record<TabNameType, JSX.Element> = {
  Website: <Website />,
  Calendar: <Calendar />,
  Blog: <Blog />,
  Employees: <Employees />,
  Vacancies: <Vacancies />,
  "Photo Review": <PhotoReview />,
  Partners: <Partners />,
  "Client Reviews": <ClientReviews />,
  FAQ: <Faq />,
  Map: <Cities />,
};

const MarketingWorkflow: FC = () => {
  const storedActiveTab = localStorage.getItem("activeTab") as TabNameType;
  const [activeTab, setActiveTab] = useState<TabNameType>(
    storedActiveTab || "Calendar"
  );
  const navigate = useNavigate();

  const handleTabClick = (tabName: TabNameType) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
    const query = new URLSearchParams();
    query.delete("vacancyId");
    query.delete("vacancyAddNew");
    query.delete("employeeId");
    query.delete("employeeAddNew");
    navigate({
      pathname: window.location.pathname,
      search: query.toString(),
    });
  };

  return (
    <div className={styles.box}>
      <MainHeader activeTab={activeTab} handleTabClick={handleTabClick} />
      {tabs[activeTab]}
    </div>
  );
};

export default MarketingWorkflow;
