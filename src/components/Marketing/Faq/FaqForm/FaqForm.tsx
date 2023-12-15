//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
import classNames from "classnames";
//libs
import { useState, FC } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
//redux
import { createFaq, updateFaq } from "reduxFolder/slices/marketingFAQ.slice";
//types
import { AppDispatch } from "types/index";
import { IFaq, IUpdateFaqPayload } from "types/marketing";

type Props = {
  onDelete?: () => void;
  onCloseForm: () => void;
  page_name: IFaq["page_name"];
  faq?: {
    id: number;
    question: string;
    answer: string;
  };
};
const FaqForm: FC<Props> = ({ onDelete, onCloseForm, faq, page_name }) => {
  const [deleteBtnValue] = useState<"loading..." | "Delete">("Delete");

  const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdateFaqPayload["data"]>({
    defaultValues: {
      answer: faq?.answer || "",
      question: faq?.question || "",
    },
  });

  const editOrSaveBtnValue = "Add";

  const onSubmit: SubmitHandler<IUpdateFaqPayload["data"]> = (data) => {
    if (faq) {
      dispatch(
        updateFaq({
          id: faq.id,
          data,
        })
      ).then(() => {
        reset();
        onCloseForm();
      });
    } else {
      dispatch(createFaq({ ...data, page_name })).then(() => {
        reset();
        onCloseForm();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classNames(styles.card)}>
      <div className={styles.dataBlock}>
        <div className={styles.topRow}>
          <Controller
            name="question"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input className={styles.title} type="text" {...field} />
            )}
          />
          {errors.question && (
            <span className={styles.error}>This field is required</span>
          )}
          <Controller
            name="answer"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea className={styles.title}  {...field} />
            )}
          />
          {errors.answer && (
            <span className={styles.error}>This field is required</span>
          )}
        </div>
      </div>
      <div className={styles.btnsBlock}>
        {faq && onDelete && (
          <button onClick={onDelete} className={general.primaryButton}>
            {deleteBtnValue}
          </button>
        )}
        <button type="submit" className={classNames(general.secondaryButton)}>
          {editOrSaveBtnValue}
        </button>
      </div>
    </form>
  );
};

export default FaqForm;
