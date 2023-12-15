import React, { useState, useRef } from "react";
import styles from "./Picture.module.scss";
import addImage from "assets/icons/addImage.svg";
import chevronDown from "assets/icons/chevronDown.svg";
import { useSelector } from "react-redux";
import { RootStateType } from "types/index";

interface IPicture {
  title: string;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  primary_image: File | undefined;
  blockImage?: File;
  imageType?: "horizontal" | "vertical" | undefined;
  setImageType?: React.Dispatch<
    React.SetStateAction<"horizontal" | "vertical" | undefined>
  >;
}

const Picture = ({
  title,
  setImage,
  primary_image,
  blockImage,
  imageType,
  setImageType,
}: IPicture) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setImage(file);
        setSelectedImage(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.picturesBlock}>
      <div className={styles.subtitle}>{title}*</div>
      <img
        className={`${styles.picture} ${
          selectedImage || primary_image || blockImage ? styles.active : ""
        }`}
        src={
          selectedImage
            ? selectedImage
            : primary_image !== undefined
            ? primary_image.toString()
            : blockImage
            ? blockImage.toString()
            : selectedImage || addImage
        }
        alt={selectedImage || blockImage ? "Selected" : "Add"}
        onClick={handleImageClick}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        ref={inputRef}
      />

      <div className={styles.buttons}>
        {blockImage !== undefined && setImageType && (
          <select
            className={styles.selector}
            value={imageType}
            onChange={(event) =>
              setImageType(event.target.value as "horizontal" | "vertical")
            }
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        )}

        <button
          className={
            selectedImage || blockImage || primary_image ? styles.active : ""
          }
          onClick={
            selectedImage || blockImage || primary_image
              ? handleImageClick
              : undefined
          }
        >
          Edit
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M11.6601 0.581051L4.04013 8.20105C3.7491 8.49051 3.51837 8.83483 3.36131 9.21407C3.20425 9.59331 3.12398 9.99994 3.12513 10.4104V11.2498C3.12513 11.4156 3.19098 11.5745 3.30819 11.6917C3.4254 11.8089 3.58437 11.8748 3.75013 11.8748H4.58951C4.99998 11.876 5.40661 11.7957 5.78586 11.6386C6.1651 11.4816 6.50942 11.2508 6.79888 10.9598L14.4189 3.3398C14.7841 2.97365 14.9892 2.4776 14.9892 1.96042C14.9892 1.44325 14.7841 0.947194 14.4189 0.581051C14.0474 0.225984 13.5534 0.027832 13.0395 0.027832C12.5256 0.027832 12.0316 0.225984 11.6601 0.581051ZM13.5351 2.45605L5.91513 10.076C5.56271 10.4263 5.08639 10.6235 4.58951 10.6248H4.37513V10.4104C4.37644 9.91354 4.57361 9.43722 4.92388 9.08479L12.5439 1.4648C12.6774 1.33727 12.8549 1.26611 13.0395 1.26611C13.2241 1.26611 13.4016 1.33727 13.5351 1.4648C13.6663 1.59637 13.74 1.77461 13.74 1.96042C13.74 2.14624 13.6663 2.32448 13.5351 2.45605Z"
              fill="#949494"
            />
            <path
              d="M14.375 5.61187C14.2092 5.61187 14.0503 5.67772 13.933 5.79493C13.8158 5.91214 13.75 6.07111 13.75 6.23687V9.37499H11.25C10.7527 9.37499 10.2758 9.57254 9.92417 9.92417C9.57254 10.2758 9.37499 10.7527 9.37499 11.25V13.75H3.125C2.62772 13.75 2.1508 13.5524 1.79917 13.2008C1.44754 12.8492 1.25 12.3723 1.25 11.875V3.125C1.25 2.62772 1.44754 2.1508 1.79917 1.79917C2.1508 1.44754 2.62772 1.25 3.125 1.25H8.77624C8.942 1.25 9.10098 1.18415 9.21819 1.06694C9.3354 0.949731 9.40124 0.79076 9.40124 0.625C9.40124 0.459239 9.3354 0.300268 9.21819 0.183058C9.10098 0.065848 8.942 0 8.77624 0L3.125 0C2.2965 0.00099241 1.50222 0.330551 0.916387 0.916387C0.330551 1.50222 0.00099241 2.2965 0 3.125L0 11.875C0.00099241 12.7035 0.330551 13.4978 0.916387 14.0836C1.50222 14.6694 2.2965 14.999 3.125 15H10.2144C10.6249 15.0012 11.0317 14.9209 11.411 14.7638C11.7904 14.6068 12.1348 14.376 12.4244 14.085L14.0844 12.4237C14.3755 12.1343 14.6063 11.79 14.7634 11.4107C14.9206 11.0315 15.001 10.6249 15 10.2144V6.23687C15 6.07111 14.9341 5.91214 14.8169 5.79493C14.6997 5.67772 14.5408 5.61187 14.375 5.61187ZM11.5406 13.2012C11.2894 13.4519 10.9717 13.6254 10.625 13.7012V11.25C10.625 11.0842 10.6908 10.9253 10.8081 10.8081C10.9253 10.6908 11.0842 10.625 11.25 10.625H13.7031C13.6258 10.9709 13.4525 11.2881 13.2031 11.54L11.5406 13.2012Z"
              fill="#949494"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Picture;
