import styles from "./LabelInput.module.scss";

interface ILabelInput {
  label: string;
  title: string | undefined;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>> ;
}

const LabelInput = ({ label, title, setTitle }: ILabelInput) => {
  return (
    <div className={styles.block}>
      <div className={styles.subtitle}>{label}*</div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Type..."
      />
    </div>
  );
};

export default LabelInput;
