//components
import ClientReviewsList from "./ClientReviewsList/ClientReviewsList";
import PagePicker from "./PageTablesPicker/PagePicker";
//styles
import styles from "./index.module.scss";
//images
import smallPlus from "assets/icons/smallPlus.svg";
import classNames from "classnames";
//types
import { webPagesLocalPages } from "../Website/types";
import { ICustomerReview } from "types/marketing";
//libd
import { useState } from "react";

const ClientReviews = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currPage, setCurrePage] = useState<ICustomerReview["page_name"]>(localStorage.getItem("customerReviewsPage") as ICustomerReview["page_name"] || webPagesLocalPages["home page"]);

  const onAdd = () => setIsFormOpen((prev) => !prev);

  const onCloseForm = () => setIsFormOpen(false);


  const onTabClick = (page: ICustomerReview["page_name"]) => {
    localStorage.setItem("customerReviewsPage", page)
    setCurrePage(page)
  }

  return (
    <div className={styles.container}>
      <PagePicker data={Object.values(webPagesLocalPages)} onTabClick={onTabClick} activeTab={currPage} />
      <div className={styles.row}>
        <span className={styles.bold}> To use references in the text:</span>
        {"This is plain text, but here is {{https://example.com | this link}}."}
        <button
          onClick={onAdd}
          className={classNames(styles.primaryButton, styles.addBtn)}
        >
          Add <img src={smallPlus} />
        </button>
      </div>
      <ClientReviewsList {...{ isFormOpen, onCloseForm, currPage }} />
    </div>
  );
};

export default ClientReviews;
