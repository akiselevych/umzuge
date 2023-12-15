import React, { FC } from "react";
import styles from "./PicturesBlock.module.scss";
import Picture from "./Picture/Picture";

interface PicturesBlockProps {
  title: string;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  primary_image?: File | undefined;
  blockImage?: File;
  imageType?: "horizontal" | "vertical" | undefined;
  setImageType?: React.Dispatch<
    React.SetStateAction<"horizontal" | "vertical" | undefined>
  >;
}

const PicturesBlock: FC<PicturesBlockProps> = ({
  title,
  setImage,
  primary_image,
  blockImage,
  imageType,
  setImageType,
}) => {
  return (
    <div className={styles.picturesContainer}>
      <Picture
        title={title}
        setImage={setImage}
        primary_image={primary_image}
        blockImage={blockImage}
        imageType={imageType}
        setImageType={setImageType}
      />
    </div>
  );
};

export default PicturesBlock;
