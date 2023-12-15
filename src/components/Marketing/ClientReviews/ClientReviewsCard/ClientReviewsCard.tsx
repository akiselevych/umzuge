import { FC, useState, Fragment } from "react";
//components
import ClientReviewsForm from "../ClientReviewsForm/ClientReviewsForm";
//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
import classNames from "classnames";
//redux
import { useDispatch } from "react-redux";
import { deleteCustomerReview } from "reduxFolder/slices/marketingClientReviews.slice";
//type
import { ICustomerReview } from "types/marketing";
import { AppDispatch } from "types/index";

const star = <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.82834 1.85184C10.1041 1.29679 10.8959 1.29679 11.1717 1.85183L13.4239 6.38484C13.5331 6.60464 13.743 6.7571 13.9857 6.79304L18.9929 7.53427C19.606 7.62503 19.8506 8.37806 19.408 8.81185L15.7928 12.3546C15.6175 12.5264 15.5374 12.7731 15.5782 13.0151L16.4205 18.0062C16.5237 18.6174 15.8831 19.0828 15.3338 18.7958L10.8472 16.4524C10.6297 16.3387 10.3703 16.3387 10.1528 16.4524L5.66623 18.7958C5.11688 19.0828 4.47632 18.6174 4.57946 18.0062L5.42179 13.0151C5.46263 12.7731 5.38248 12.5264 5.20719 12.3546L1.59202 8.81185C1.14937 8.37806 1.39404 7.62503 2.00713 7.53427L7.01426 6.79304C7.25705 6.7571 7.46689 6.60464 7.57609 6.38484L9.82834 1.85184Z" fill="#FCD503" />
</svg>


const ClientReviewsCard: FC<ICustomerReview> = ({
  reviewer_name,
  review_text,
  page_name,
  rating,
  id,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deleteBtnValue] = useState<"loading..." | "Delete">("Delete");

  const [mode, setMode] = useState<"edit" | "view">("view");

  const onEdit = () => {
    if (mode === "edit") {
      setMode("view");
    } else {
      setMode("edit");
    }
  };

  const onDelete = () => {
    dispatch(deleteCustomerReview(id));
  };

  const editOrSaveBtnValue = "Edit";

  if (mode === "edit")
    return (
      <div className={classNames(styles.editMode)}>
        <ClientReviewsForm
          {...{
            page_name,
            onDelete,
            onCloseForm: () => setMode("view"),
            review: { reviewer_name, review_text, id, rating },
          }}
        />
      </div>
    );

  return (
    <div className={classNames(styles.card)}>
      <div className={styles.dataBlock}>
        <div className={styles.topRow}>
          <div className={styles.nameBlock}>
            <h5 className={styles.title}>{reviewer_name}</h5>
            <div className={styles.stars}>
              {Array(Math.floor(rating)).fill(null).map((_, i) => <Fragment key={i}>{star}</Fragment>)}
            </div>
          </div>
          <p className={styles.type}>{review_text}</p>
        </div>
      </div>
      <div className={styles.btnsBlock}>
        <button onClick={onDelete} className={general.primaryButton}>
          {deleteBtnValue}
        </button>
        <button
          onClick={onEdit}
          className={classNames(general.secondaryButton)}
        >
          {editOrSaveBtnValue}
        </button>
      </div>
    </div>
  );
};

export default ClientReviewsCard;
