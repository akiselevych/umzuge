import { FC } from "react";
//styles
import styles from "./index.module.scss";

type Props = {
  onAddNew: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const PartnerForm: FC<Props> = ({ onAddNew }) => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Add</p>
      <div className={styles.imageBody}>
        ADD
        <input
          className={styles.file}
          type="file"
          id="photo-upload"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onAddNew(e)
            if (e.target) {
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default PartnerForm;
