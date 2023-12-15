//components
import FaqList from "./FaqList/FaqList";
import PagePicker from "./PagePicker/PagePicker";
import { IFaq } from "types/marketing";
import { webPagesLocalPages } from "components/Marketing/Website/types/index"
//styles
import styles from "./index.module.scss";
//images
import smallPlus from "assets/icons/smallPlus.svg";
import classNames from "classnames";
//lib
import { useState } from "react";

const Faq = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currPage, setCurrePage] = useState<IFaq["page_name"]>(localStorage.getItem("faqPage") as IFaq["page_name"] || webPagesLocalPages["home page"]);
  const onAdd = () => setIsFormOpen((prev) => !prev);

  const onCloseForm = () => setIsFormOpen(false);

  const onTabClick = (page: IFaq["page_name"]) => {
    localStorage.setItem("faqPage", page)
    setCurrePage(page)
  }

  return (
    <div className={styles.container}>
      <PagePicker data={Object.values(webPagesLocalPages)} onTabClick={onTabClick} activeTab={currPage} />
      <button
        onClick={onAdd}
        className={classNames(styles.primaryButton, styles.addBtn)}
      >
        Add <img src={smallPlus} />
      </button>
      <FaqList{...{ isFormOpen, onCloseForm, currPage }} />
    </div >
  );
};

export default Faq;
