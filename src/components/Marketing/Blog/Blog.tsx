import { FC, useEffect, useRef, useState } from "react";
import styles from "./Blog.module.scss";
import plusIcon from "assets/icons/plus.svg";
import Post from "./Post/Post";
import AddPostForm from "./AddPostForm/AddPostForm";
import { AppDispatch, RootStateType } from "types/index";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlock,
  addPost,
  addPostBlock,
  clearBlocks,
  clearFetchedBlocks,
  clearFetchedPost,
  deletePostBlock,
  editPost,
  editPostBlock,
  fetchPosts,
} from "reduxFolder/slices/marketingBlogSlice";
import moment from "moment";
import BlogLegend from "./BlogLegend/BlogLegend";

const Blog: FC = () => {
  const posts = useSelector((state: RootStateType) => state.marketing.posts);
  const blocks = useSelector((state: RootStateType) => state.marketing.blocks);
  const fetchedBlocks = useSelector(
    (state: RootStateType) => state.marketing.fetchedBlocks
  );
  const fetchedPost = useSelector(
    (state: RootStateType) => state.marketing.fetchedPost
  );

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changingId, setChangingId] = useState<number>(1);

  const [title, setTitle] = useState<string | undefined>("");
  const [shortDescription, setShortDescription] = useState<string | undefined>(
    ""
  );
  const [metaTitle, setMetaTitle] = useState<string | undefined>("");
  const [metaDesc, setMetaDesc] = useState<string | undefined>("");
  const [primaryImage, setPrimaryImage] = useState<File | undefined>();
  const [choiceActive, setChoiceActive] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [category, setCategory] = useState<"Unkategorisiert" | "Umzüge">(
    "Unkategorisiert"
  );
  const choiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        choiceRef.current &&
        !choiceRef.current.contains(event.target as Node)
      ) {
        setChoiceActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedIsAdding = localStorage.getItem("isAdding");
    if (storedIsAdding) {
      setIsAdding(JSON.parse(storedIsAdding));
    }
  }, []);

  // Update localStorage whenever isAdding state changes
  useEffect(() => {
    localStorage.setItem("isAdding", JSON.stringify(isAdding));
  }, [isAdding]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPosts());
    };

    fetchData();
  }, [dispatch, isAdding, isEditing]);

  const PostsComponents = posts.map((post, i) => (
    <Post
      key={post.id}
      {...post}
      setIsEditing={setIsEditing}
      setChangingId={setChangingId}
    />
  ));

  const handleBackToBlog = async () => {
    dispatch(clearBlocks());
    setIsAdding(false);
    setIsEditing(false);
    setTitle("");
    setShortDescription("");
    setMetaTitle("");
    setMetaDesc("");
    setPrimaryImage(undefined);
    if (isEditing) {
      dispatch(clearFetchedBlocks());
      dispatch(clearFetchedPost());
    }
    setChoiceActive(false);
  };

  const handleCreateArticle = (choice: "text" | "image") => {
    const currentPostId = fetchedPost?.id ? fetchedPost.id : 1;

    dispatch(
      addBlock({
        id: blocks.length >= 1 ? blocks[blocks.length - 1].id + 1 : 1,
        block_type: choice,
        block_title: "",
        content: "",
        image: undefined,
        image_type: "horizontal",
        post: currentPostId > 0 ? currentPostId : 1,
      })
    );
  };

  const handleAddClick = async () => {
    if (isAdding) {
      const addedPostAction = await dispatch(
        addPost({
          id: 0,
          title: title ? title : "",
          short_description: shortDescription ? shortDescription : "",
          category: category,
          primary_image: primaryImage,
          date_posted: moment().format(),
          meta_title: metaTitle ? metaTitle : "",
          meta_description: metaDesc ? metaDesc : "",
          comment_count: commentCount,
        })
      );

      // Extract the added post from the action payload
      const addedPost = addedPostAction.payload;

      const newPostId = addedPost.id;

      await dispatch(fetchPosts());

      const processBlocks = async () => {
        for (const block of blocks) {
          if (block.image && !(block.image instanceof File)) {
            const { name, type, url } = block.image;

            const response = await fetch(url);
            const blob = await response.blob();

            const file = new File([blob], name, { type });

            dispatch(
              addPostBlock({
                id: block.id,
                block_type: block.block_type,
                block_title: block.block_title,
                content: block.content,
                image: file,
                image_type: block.image_type,
                post: newPostId,
              })
            );
          } else {
            dispatch(
              addPostBlock({
                id: block.id,
                block_type: block.block_type,
                block_title: block.block_title,
                content: block.content,
                image: undefined,
                image_type: block.image_type,
                post: newPostId,
              })
            );
          }
        }
      };

      await processBlocks();

      setTitle("");
      setShortDescription("");
      dispatch(clearBlocks());
      setIsAdding(false);
      setMetaTitle("");
      setMetaDesc("");
    } else if (isEditing) {
      await dispatch(
        editPost({
          id: changingId.toString(),
          data: {
            id: fetchedPost?.id,
            title: title,
            short_description: shortDescription,
            category: category,
            primary_image: primaryImage,
            comment_count: 0,
            comments: [],
            meta_title: metaTitle,
            meta_description: metaDesc,
          },
        })
      );
      await dispatch(fetchPosts());

      if (blocks.length < fetchedBlocks.length) {
        const deletedBlocks = fetchedBlocks.filter((fetchedBlock) => {
          // Використовуйте find, щоб перевірити, чи є блок в fetchedBlocks
          return !blocks.find((block) => block.id === fetchedBlock.id);
        });

        for (const block of deletedBlocks) {
          await dispatch(deletePostBlock(block.id));
        }
      } else if (fetchedBlocks.length === blocks.length) {
        for (const block of fetchedBlocks) {
          if (
            block.image?.name !== undefined &&
            block.image &&
            !(block.image instanceof File)
          ) {
            const { name, type, url } = block.image;

            const response = await fetch(url);
            const blob = await response.blob();

            const file = new File([blob], name, { type });

            await dispatch(
              editPostBlock({
                id: block.id.toString(),
                data: {
                  id: block.id,
                  block_type: block.block_type,
                  block_title: block.block_title,
                  content: block.content,
                  image: file,
                  image_type: block.image_type,
                  post: block.post,
                },
              })
            );
          } else {
            await dispatch(
              editPostBlock({
                id: block.id.toString(),
                data: {
                  id: block.id,
                  block_type: block.block_type,
                  block_title: block.block_title,
                  content: block.content,
                  image: block.image instanceof File ? block.image : undefined,
                  image_type: block.image_type,
                  post: block.post,
                },
              })
            );
          }
        }
      } else if (blocks.length > fetchedBlocks.length) {
        const newBlocks = blocks.filter((block) => {
          // Використовуйте find, щоб перевірити, чи є блок в fetchedBlocks
          return !fetchedBlocks.find(
            (fetchedBlock) => fetchedBlock.id === block.id
          );
        });
        for (const block of newBlocks) {
          if (block.image && !(block.image instanceof File)) {
            const { name, type, url } = block.image;

            const response = await fetch(url);
            const blob = await response.blob();

            const file = new File([blob], name, { type });

            await dispatch(
              addPostBlock({
                id: block.id,
                block_type: block.block_type,
                block_title: block.block_title,
                content: block.content,
                image: file,
                image_type: block.image_type,
                post: block.post,
              })
            );
          } else {
            await dispatch(
              addPostBlock({
                id: block.id,
                block_type: block.block_type,
                block_title: block.block_title,
                content: block.content,
                image: undefined,
                image_type: block.image_type,
                post: block.post,
              })
            );
          }
        }
      }

      setIsEditing(false);
      dispatch(clearBlocks());
      dispatch(clearFetchedBlocks());
      dispatch(clearFetchedPost());
      setChoiceActive(false);
    }
  };

  const handleAddImageBlock = () => {
    handleCreateArticle("image");
    setChoiceActive(false);
  };

  const handleAddTextBlock = () => {
    handleCreateArticle("text");
    setChoiceActive(false);
  };

  const DefaultBlogView = (
    <>
      <button className={styles.addButton} onClick={() => setIsAdding(true)}>
        Add <img src={plusIcon} alt="plus" />
      </button>
      <div className={styles.posts}>{PostsComponents}</div>
    </>
  );

  const AddBlogView = (
    <>
      <button className={styles.backButton} onClick={handleBackToBlog}>
        {`<`} Back to Blog
      </button>
      <AddPostForm
        postID={
          isAdding
            ? posts.length > 0
              ? posts[posts.length - 1].id + 1
              : 1
            : isEditing
            ? changingId
            : 1
        }
        title={title === undefined ? "" : title}
        setTitle={setTitle}
        shortDescription={
          shortDescription === undefined ? "" : shortDescription
        }
        setShortDescription={setShortDescription}
        primary_image={primaryImage}
        setPrimaryImage={setPrimaryImage}
        isEditing={isEditing}
        metaTitle={metaTitle}
        metaDesc={metaDesc}
        setMetaTitle={setMetaTitle}
        setMetaDesc={setMetaDesc}
        category={category}
        setCategory={setCategory}
      />
      <div className={styles.legendContainer}>
        <BlogLegend />
      </div>
      <div
        ref={choiceRef}
        className={`${styles.choice} ${
          choiceActive === true ? styles.active : ""
        }`}
      >
        <button onClick={handleAddImageBlock}>Picture</button>
        <button onClick={handleAddTextBlock}>Description</button>
      </div>
      <div ref={choiceRef} className={styles.buttons}>
        <button
          onClick={() => setChoiceActive(!choiceActive)}
          className={styles.createButton}
        >
          + Article Block
        </button>
        <button className={styles.addButton} onClick={handleAddClick}>
          {isAdding ? "Add" : "Save changes"}
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.blog}>
      {isAdding || isEditing ? AddBlogView : DefaultBlogView}
    </div>
  );
};

export default Blog;
