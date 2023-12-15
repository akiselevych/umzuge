import { FC, useEffect, useRef, useState } from "react";
import styles from "./ArticleBlock.module.scss";
import LabelInput from "./LabelInput/LabelInput";
import PicturesBlock from "../PicturesBlock/PicturesBlock";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootStateType } from "types/index";
import { IBlock } from "types/marketing";
import {
  addPostBlock,
  deleteBlock,
  deletePostBlock,
  fetchBlocks,
  setBlockDescription,
  setBlockImage,
  setBlockImageType,
  setBlockTitle,
} from "reduxFolder/slices/marketingBlogSlice";

interface ArticleBlockProps {
  id: number;
  blocks: IBlock[];
}

const ArticleBlock: FC<ArticleBlockProps> = ({ id, blocks }) => {
  const fetchedBlocks = useSelector(
    (state: RootStateType) => state.marketing.fetchedBlocks
  );
  const fetchedPost = useSelector(
    (state: RootStateType) => state.marketing.fetchedPost
  );
  const myBlock =
    fetchedBlocks.length === 0 || blocks.length > 0
      ? blocks.find((block) => block.id === id)
      : fetchedBlocks.find((block) => block.id === id);

  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState<string | undefined>(myBlock?.block_title);
  const [description, setDescription] = useState(myBlock?.content);
  const [image, setImage] = useState<File | undefined>(
    fetchedPost?.blocks.find((block) => block.id === id)?.image
  );
  const [imageType, setImageType] = useState<"horizontal" | "vertical">();
  const isInitialRender = useRef(true);

  useEffect(() => {
    const updateBlockData = async () => {
      if (isInitialRender.current) {
        // Skip the first render
        isInitialRender.current = false;
        return;
      }

      dispatch(
        setBlockTitle({
          title: title === undefined ? "" : title,
          blockId: myBlock ? myBlock.id : 1,
        })
      );
    };

    updateBlockData();
  }, [title]);

  useEffect(() => {
    const updateBlockData = async () => {
      if (isInitialRender.current) {
        // Skip the first render
        isInitialRender.current = false;
        return;
      }

      dispatch(
        setBlockDescription({
          description: description ? description : "",
          blockId: myBlock ? myBlock.id : 1,
        })
      );
    };

    updateBlockData();
  }, [description]);

  useEffect(() => {
    const updateBlockData = async () => {
      if (isInitialRender.current || image === undefined) {
        // Skip the first render
        isInitialRender.current = false;
        return;
      }
      dispatch(
        setBlockImage({
          imageInfo: image
            ? {
                name: image.name,
                type: image.type,
                url:
                  typeof image !== "string"
                    ? URL.createObjectURL(image)
                    : image, // or the server URL where the file is stored
              }
            : undefined,
          blockId: myBlock ? myBlock.id : 1,
        })
      );
    };

    updateBlockData();
  }, [image]);

  useEffect(() => {
    const updateBlockData = async () => {
      if (isInitialRender.current || imageType === undefined) {
        // Skip the first render
        isInitialRender.current = false;
        return;
      }

      dispatch(
        setBlockImageType({
          imageType: imageType ? imageType : "horizontal",
          blockId: myBlock ? myBlock.id : 1,
        })
      );
    };

    updateBlockData();
  }, [imageType]);

  const handleDeleteBlock = async () => {
    dispatch(deleteBlock(myBlock ? myBlock.id : 0));
  };

  return (
    myBlock && (
      <div className={styles.articleContainer}>
        <div className={styles.articleBlock}>
          <p>Nº{blocks.findIndex((block) => block.id === myBlock.id) + 1}</p>
          <LabelInput label="Subtitle" title={title} setTitle={setTitle} />
          {myBlock.block_type === "image" && (
            <button onClick={handleDeleteBlock} className={styles.button}>
              Delete
            </button>
          )}
          {myBlock.block_type === "text" && (
            <div className={styles.block}>
              <div className={styles.subtitle}>Description*</div>
              <textarea
                placeholder="Type..."
                value={description === null ? undefined : description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button onClick={handleDeleteBlock} className={styles.button}>
                Delete
              </button>
            </div>
          )}
        </div>
        {myBlock.block_type === "image" && (
          <div className={styles.picture}>
            <PicturesBlock
              title="Picture"
              setImage={setImage}
              blockImage={image}
              imageType={imageType ? imageType : myBlock.image_type}
              setImageType={setImageType}
            />
          </div>
        )}
      </div>
    )
  );
};

export default ArticleBlock;
