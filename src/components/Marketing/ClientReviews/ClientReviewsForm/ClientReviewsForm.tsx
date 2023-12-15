//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
//libs
import { useState, FC } from "react";
import classNames from "classnames";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
//redux
import {
  createCustomerReview,
  updateCustomerReview,
} from "reduxFolder/slices/marketingClientReviews.slice";
//types
import { AppDispatch } from "types/index";
import { ICustomerReview, IUpdateCustomerReviewPayload } from "types/marketing";



type Props = {
  onDelete?: () => void;
  onCloseForm: () => void;
  page_name: ICustomerReview["page_name"];
  review?: {
    reviewer_name: string;
    review_text: string;
    rating: number;
    id: number;
  };
};
const ClientReviewsForm: FC<Props> = ({ onDelete, onCloseForm, review, page_name }) => {
  const [deleteBtnValue] = useState<"loading..." | "Delete">("Delete");

  const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdateCustomerReviewPayload["data"]>({
    defaultValues: {
      review_text: review?.review_text || "",
      reviewer_name: review?.reviewer_name || "",
      rating: review?.rating ? Math.round(review?.rating) : 5,
    },
  });

  const editOrSaveBtnValue = "Add";

  const onSubmit: SubmitHandler<IUpdateCustomerReviewPayload["data"]> = (
    data
  ) => {
    if (review) {
      dispatch(
        updateCustomerReview({
          id: review.id,
          data,
        })
      ).then(() => {
        reset();
        onCloseForm();
      });
    } else {
      dispatch(createCustomerReview({ ...data, page_name: page_name })).then(() => {
        reset();
        onCloseForm();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classNames(styles.card)}>
      <div className={styles.dataBlock}>
        <div className={styles.topRow}>
          <div className={styles.nameAndStars}>
            <Controller
              name="reviewer_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input maxLength={100} className={styles.title} type="text" {...field} />
              )}
            />
            <div className={styles.strsBlock}>
              Stars:
              <Controller
                name="rating"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input type="number" max={5} min={1} step={1} className={styles.title}  {...field} />
                )}
              />
            </div>
          </div>
          {errors.reviewer_name && (
            <span className={styles.error}>This field is required</span>
          )}
          <Controller
            name="review_text"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input maxLength={445} className={styles.title} type="text" {...field} />
            )}
          />
          {errors.review_text && (
            <span className={styles.error}>This field is required</span>
          )}
        </div>
      </div>
      <div className={styles.btnsBlock}>
        {review && onDelete && (
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

export default ClientReviewsForm;
