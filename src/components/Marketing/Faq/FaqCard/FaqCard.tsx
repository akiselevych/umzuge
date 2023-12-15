import { FC, useState } from "react";
//components
import ClientReviewsForm from "../FaqForm/FaqForm";
//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
import classNames from "classnames";
//redux
import { useDispatch } from "react-redux";
import { deleteFaq } from "reduxFolder/slices/marketingFAQ.slice";
//type
import { IFaq } from "types/marketing";
import { AppDispatch } from "types/index";
//utils 
import convertLinks from "utils/convertLinks";

interface Props extends IFaq {
  number: number;
}

const FaqCard: FC<Props> = ({ question, answer, id, number, page_name }) => {
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
    dispatch(deleteFaq(id));
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
            faq: { question, answer, id },
          }}
        />
      </div>
    );

  return (
    <div className={classNames(styles.card)}>
      <div className={styles.dataBlock}>
        <div className={styles.topRow}>
          <h5 className={styles.title}>{number}.{question}</h5>
          <p className={styles.type}>{convertLinks(answer)}</p>
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

export default FaqCard;
