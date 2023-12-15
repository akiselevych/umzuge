//redux
import {
  fetchPhotoReviews,
  createPhotoReview,
  updatePhotoReviewOrder,
} from "reduxFolder/slices/marketingPhotoReviews.slice";
//libs
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
//components
import PhotoReviewCard from "../PhotoReviewCard/photoReviewCard";
import PhotoReviewForm from "../PhotoReviewForm/PhotoReviewForm";
import PhotoReviewWrapper from "../PhotoReviewWrapper/PhotoReviewWrapper";
//types
import { AppDispatch, RootStateType } from "types/index";
//styles
import styles from "./index.module.scss";

const PhotoReviewsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(
    (state: RootStateType) => state.marketingPhotoReviews.photoReviews
  );
  const fetchPhotoReviewsLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingPhotoReviews.fetchPhotoReviewsLoadingStatus
  );

  useEffect(() => {
    dispatch(fetchPhotoReviews());
    //eslint-disable-next-line
  }, []);

  const onAddNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      dispatch(createPhotoReview(formData));
    }
  };

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = reviews.find((item) => item.order === dragOrder);
      const hoverItem = reviews.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updatePhotoReviewOrder({
            dragItem: {
              id: dragItem.id,
              order: dragOrder,
            },
            hoverItem: {
              id: hoverItem.id,
              order: hoverOrder,
            },
          })
        );
      }
    },
    //eslint-disable-next-line
    [reviews]
  );

  const content =
    reviews && fetchPhotoReviewsLoadingStatus === "idle" ? (
      <>
        {reviews.map((item, index) => (
          <PhotoReviewWrapper
            moveItem={moveItem}
            photoReview={item}
            key={item.id}
          >
            <PhotoReviewCard
              imagesLength={reviews.length}
              key={index}
              {...item}
            />
          </PhotoReviewWrapper>
        ))}
        <PhotoReviewForm {...{ onAddNew }} />
      </>
    ) : null;
  const error =
    fetchPhotoReviewsLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchPhotoReviewsLoadingStatus === "error" ? <p>error...</p> : null;

  return (
    <div className={styles.list}>
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default PhotoReviewsList;
