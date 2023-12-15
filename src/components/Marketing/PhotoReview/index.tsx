//styles
import styles from "./index.module.scss";
//conmpoments
import PhotoReviewsList from "./PhotoReviewsList/PhotoReviewsList";

const PhotoReviews = () => {
  return (
    <div className={styles.container}>
      <PhotoReviewsList />
    </div>
  );
};

export default PhotoReviews;
