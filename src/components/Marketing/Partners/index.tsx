//styles
import styles from "./index.module.scss";
//conmpoments
import PartnersList from "./PartnersList/PartnersList";

const Partners = () => {
  return (
    <div className={styles.container}>
      <PartnersList />
    </div>
  );
};

export default Partners;
