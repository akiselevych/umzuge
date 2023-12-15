import styles from "./index.module.scss";
//components
import SideBar from "./SideBar/SideBar";
import PageTablesPicker from "./PageTablesPicker/PageTablesPicker";
import ImagesTable from "./Tables/ImagesTable/ImagesTable";
import MetaTable from "./Tables/MetaTable/MetaTable";
import ContentTable from "./Tables/ContentTable/ContentTable";
import HeadlinesTable from "./Tables/HeadlinesTable/HeadlinesTable";
import UpdateDataTriggerBanner from "./UpdateDataTriggerBanner/UpdateDataTriggerBanner";
import DeploymentStatusBar from "./DeploymentStatusBar/DeploymentStatusBar";
//redux
import { useSelector, useDispatch } from "react-redux";
//libs
import { ReactNode, useState } from "react";
//types
import {
  webPagesEnum,
  webPagesRepeatedBlocksEnum,
  webPagesTableType,
  webPagesLocalPages,
} from "./types";
import { RootStateType } from "types/index";
import { setCurrentTable } from "reduxFolder/slices/marketingWebPage.slice";

const tables: {
  [key in webPagesTableType]: ReactNode;
} = {
  Headlines: <HeadlinesTable />,
  Content: <ContentTable />,
  Images: <ImagesTable />,
  Meta: <MetaTable />,
};

const Website = () => {
  const currentPageName = useSelector(
    (state: RootStateType) => state.marketingWebPage.currentPageName
  );
  const [activeTableType, setActiveTableType] = useState<webPagesTableType>(
    (localStorage.getItem(
      "marketingStaticContentActiveTableType"
    ) as webPagesTableType) || webPagesTableType.Headlines
  );
  const dispatch = useDispatch();

  const onTabClick = (
    tabName: webPagesEnum | webPagesRepeatedBlocksEnum | webPagesLocalPages
  ) => {
    dispatch(setCurrentTable(tabName));
    localStorage.setItem("marketingStaticContentActiveTab", tabName);
  };

  const onTableTypeClick = (tableName: webPagesTableType) => {
    setActiveTableType(tableName);
    localStorage.setItem("marketingStaticContentActiveTableType", tableName);
  };

  return (
    <div className={styles.container}>
      <SideBar onTabClick={onTabClick} activeTab={currentPageName} />
      <div className={styles.rightCol}>
        <div className={styles.topBar}>
          <PageTablesPicker
            activeTab={activeTableType}
            onTabClick={onTableTypeClick}
          />
          <UpdateDataTriggerBanner />
          <DeploymentStatusBar />
        </div>
        {tables[activeTableType]}
      </div>
    </div>
  );
};

export default Website;
