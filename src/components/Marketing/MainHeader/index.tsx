import { TabNameType } from "../Calendar/Types/TabNameType"
import styles from "./index.module.scss"

interface IMainHeader {
  activeTab: TabNameType
  handleTabClick: (tabName: TabNameType) => void
}

const tabNames: TabNameType[] = ["Website", "Calendar", "Blog", "Employees", "Vacancies", "Photo Review", "Partners", "Client Reviews", "FAQ", "Map"]

const MainHeader = ({ activeTab, handleTabClick }: IMainHeader) => {
  const TabNamesComponents = tabNames.map((tabName, i) => (
    <p
      key={i}
      className={activeTab === tabName ? styles.active : ""}
      onClick={() => handleTabClick(tabName)}
    >
      {tabName}
    </p>
  ))

  return <header className={styles.flexRow}>
    {TabNamesComponents}
  </header>
}

export default MainHeader
