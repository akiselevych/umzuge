import { FC } from "react";
import "./styles.css";

interface ImgUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  src: string;
  width: number;
  height: number;
  styles?: {
    [key: string]: string | number | undefined;
  };
  id: number;
  propForUpdate?: any;
  srcType?: "string" | "file";
  cahce?: boolean;
}

const ImageUploader: FC<ImgUploadProps> = ({
  onChange,
  src,
  width,
  height,
  styles,
  id,
  srcType,
  cahce,
}) => {
  const uniqueSrc =
    cahce && srcType === "string"
      ? src + "?timestamp=" + new Date().getTime()
      : src;

  return (
    <label htmlFor={`photo-upload${id}`} className="custom-file-upload fas">
      <div
        className="img-wrap img-upload"
        style={{ width: width, height: height, ...styles }}
      >
        {src ? (
          <img
            style={{ width: width, height: height, ...styles }}
            className="avatar-img"
            src={uniqueSrc}
            alt=""
          />
        ) : (
          <span
            style={{ width: width, height: height, ...styles }}
            className="add-photo-text"
          >
            Foto{" "}
          </span>
        )}
      </div>
      <input
        className="photo-upload"
        id={`photo-upload${id}`}
        type="file"
        onChange={onChange}
      />
    </label>
  );
};

export default ImageUploader;
