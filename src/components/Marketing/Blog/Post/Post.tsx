import { FC } from "react";
import styles from "./Post.module.scss";
import commentIcon from "assets/icons/comment.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "types/index";
import {
  deletePost,
  fetchBlocks,
  fetchPosts,
} from "reduxFolder/slices/marketingBlogSlice";

interface PostProps {
  id: number;
  primary_image: File | undefined;
  title: string;
  short_description: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setChangingId: React.Dispatch<React.SetStateAction<number>>;
  comment_count: number;
}

const Post: FC<PostProps> = (props) => {
  const {
    id,
    primary_image,
    title,
    short_description,
    setIsEditing,
    setChangingId,
    comment_count,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const handleChangeClick = () => {
    setIsEditing(true);
    setChangingId(id);
  };

  const handleDeleteClick = async () => {
    await dispatch(deletePost(id));
    await dispatch(fetchPosts());
  };

  return (
    <div className={styles.post}>
      <img
        src={primary_image ? primary_image.toString() : ""}
        alt="image"
        className={styles.mainImg}
      />
      <h2>{title}</h2>
      <p>{short_description}</p>
      <div className={styles.comments}>
        <img src={commentIcon} alt="comments" /> {comment_count}
      </div>
      <div className={styles.buttons}>
        <button onClick={handleDeleteClick}>Delete</button>
        <button onClick={handleChangeClick}>Edit</button>
      </div>
    </div>
  );
};

export default Post;
