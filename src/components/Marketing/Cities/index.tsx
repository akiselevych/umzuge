//styles
import styles from "./index.module.scss";
//conmpoments
import CitiesList from "./CitiesList/CitiesList";

const Cities = () => {
  return (
    <div className={styles.container}>
      <CitiesList />
    </div>
  );
};

export default Cities;
