import { FC } from "react";
import styles from "components/ModalWindow/ModalWindow.module.scss";
import Logo from "assets/images/Logo.svg";
import CloseButton from "assets/icons/closeIcon.svg";

type PropsType = {
  withLogo?: boolean;
  removeCloseButton?: boolean;
  onClose?: () => void;
  setIsModaltOpen?: (value: boolean) => void;
};

const ModalWindowHeader: FC<PropsType> = ({
  removeCloseButton,
  withLogo,
  onClose,
  setIsModaltOpen,
}) => {
  return (
    <div
      className={withLogo ? styles.modalWithHeader : styles.modalWithOutHeader}
    >
      {withLogo && (
        <img className={styles.modalHeaderLogo} src={Logo} alt="logo" />
      )}
      {!removeCloseButton && (
        <button style={{ background: "none" }}>
          <img
            className={styles.modalHeaderClose}
            src={CloseButton}
            alt="close"
            onClick={setIsModaltOpen ? () => {
              setIsModaltOpen(false) 
              onClose && onClose()
            } : undefined}
          />
        </button>
      )}
    </div>
  );
};

export default ModalWindowHeader;
