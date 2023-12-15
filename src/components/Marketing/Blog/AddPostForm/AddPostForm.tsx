import { FC, useEffect, useState } from "react";
import styles from "./AddPostForm.module.scss";
import ArticleBlock from "./ArticleBlock/ArticleBlock";
import LabelInput from "./ArticleBlock/LabelInput/LabelInput";
import PicturesBlock from "./PicturesBlock/PicturesBlock";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootStateType } from "types/index";
import {
  fetchBlocks,
  getPostById,
} from "reduxFolder/slices/marketingBlogSlice";

interface IAddPostForm {
  postID: number;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  shortDescription: string;
  setShortDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  primary_image: File | undefined;
  setPrimaryImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  isEditing: boolean;
  metaTitle: string | undefined;
  metaDesc: string | undefined;
  setMetaTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMetaDesc: React.Dispatch<React.SetStateAction<string | undefined>>;
  category: "Unkategorisiert" | "Umzüge"; 
  setCategory: React.Dispatch<
    React.SetStateAction<"Unkategorisiert" | "Umzüge">
  >;
}

const AddPostForm: FC<IAddPostForm> = ({
  postID,
  title,
  shortDescription,
  setShortDescription,
  setTitle,
  primary_image,
  setPrimaryImage,
  isEditing,
  metaTitle,
  metaDesc,
  setMetaTitle,
  setMetaDesc,
  category,
  setCategory,
}) => {
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const blocks = useSelector((state: RootStateType) => state.marketing.blocks);
  const fetchedPost = useSelector(
    (state: RootStateType) => state.marketing.fetchedPost
  );
  const fetchedBlocks = useSelector(
    (state: RootStateType) => state.marketing.fetchedBlocks
  );

  const dispatch = useDispatch<AppDispatch>();

  if (isEditing) {
    useEffect(() => {
      if (!initialFetchDone) {
        dispatch(getPostById(postID.toString()));
        setInitialFetchDone(true);
      }

      setTitle(fetchedPost?.title);
      setCategory(
        fetchedPost?.category ? fetchedPost?.category : "Unkategorisiert"
      );
      setShortDescription(fetchedPost?.short_description);
      setPrimaryImage(fetchedPost?.primary_image);
      setMetaTitle(fetchedPost?.meta_title);
      setMetaDesc(fetchedPost?.meta_description);
    }, [fetchedPost]);
  } else {
    useEffect(() => {
      if (!initialFetchDone) {
        setInitialFetchDone(true);
      }
    }, [blocks]);
  }

  const blocksComponents = () => {
    if (blocks.length === 0) {
      return [];
    }
    return fetchedBlocks.length === 0 || blocks.length > 0
      ? blocks.map((block) => {
          return (
            <div key={block.id} className={styles.articles}>
              <ArticleBlock id={block.id} blocks={blocks} />
            </div>
          );
        })
      : fetchedBlocks.map((block) => {
          return (
            <div key={block.id} className={styles.articles}>
              <ArticleBlock id={block.id} blocks={blocks} />
            </div>
          );
        });
  };

  return (
    <div className={styles.addPostContainer}>
      <div className={styles.addPostForm}>
        <div className={styles.mainMeta}>
          <div className={styles.mainTitles}>
            <div className={styles.mainInputs}>
              <LabelInput label="Title" title={title} setTitle={setTitle} />
              <LabelInput
                label="Short description"
                title={shortDescription}
                setTitle={setShortDescription}
              />
              <select
                value={category}
                className={styles.selector}
                onChange={(event) =>
                  setCategory(
                    event.target.value as "Unkategorisiert" | "Umzüge"
                  )
                }
              >
                <option value={"Unkategorisiert"}>Unkategorisiert</option>
                <option value={"Umzüge"}>Umzüge</option>
              </select>
            </div>
            <PicturesBlock
              title="Main picture"
              primary_image={primary_image}
              setImage={setPrimaryImage}
            />
          </div>

          <div className={styles.articleContainer}>
            <div className={styles.articleBlock}>
              <LabelInput
                label="Meta-title"
                title={metaTitle ? metaTitle : ""}
                setTitle={setMetaTitle}
              />
              <div className={styles.block}>
                <div className={styles.subtitle}>Meta-Description*</div>
                <textarea
                  className={styles.textarea}
                  placeholder="Type..."
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.articlesGrid}>{blocksComponents()}</div>
      </div>
    </div>
  );
};

export default AddPostForm;
