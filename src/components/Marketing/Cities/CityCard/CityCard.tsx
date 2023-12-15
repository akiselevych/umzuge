import { FC, useEffect, useState, useRef } from "react";
import { useDebounce } from "hooks/useDebounce";
//styles
import styles from "./index.module.scss";
//redux
import { useDispatch } from "react-redux";
import {
  deleteCity,
  updateCity,
} from "reduxFolder/slices/marketingCities.slice";
//type
import { ICity } from "types/marketing";
import { AppDispatch } from "types/index";

interface Props extends ICity {
  required?: boolean;
}

const CityCard: FC<Props> = ({ id, relocation_type, city_name }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState<string>(city_name);
  const debauncedValue = useDebounce(inputValue, 500);
  const mountCounter = useRef(0);

  useEffect(() => {
    if (mountCounter.current && debauncedValue) {
      dispatch(
        updateCity({
          id,
          data: {
            city_name: debauncedValue,
            relocation_type,
          },
        })
      );
    }
    //eslint-disable-next-line
  }, [debauncedValue]);

  useEffect(() => {
    setInputValue(city_name);
  }, [city_name]);

  const onDelete = () => {
    dispatch(deleteCity(id));
  };

  useEffect(() => {
    mountCounter.current++;
  });

  return (
    <div className={styles.card}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
      />
      <div onClick={onDelete} className={styles.delete}>
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8059 4.33272H14.0428C13.9108 3.67455 13.5616 3.08317 13.0539 2.65825C12.5463 2.23332 11.9113 2.00085 11.256 2L10.1186 2C9.46329 2.00085 8.82831 2.23332 8.32068 2.65825C7.81305 3.08317 7.4638 3.67455 7.3318 4.33272H5.56873C5.41789 4.33272 5.27324 4.39417 5.16658 4.50353C5.05992 4.6129 5 4.76123 5 4.9159C5 5.07057 5.05992 5.21891 5.16658 5.32827C5.27324 5.43764 5.41789 5.49908 5.56873 5.49908H6.13746V13.0804C6.13837 13.8535 6.43825 14.5946 6.97135 15.1413C7.50444 15.6879 8.22721 15.9954 8.98112 15.9963H12.3935C13.1474 15.9954 13.8702 15.6879 14.4033 15.1413C14.9364 14.5946 15.2363 13.8535 15.2372 13.0804V5.49908H15.8059C15.9567 5.49908 16.1014 5.43764 16.2081 5.32827C16.3147 5.21891 16.3746 5.07057 16.3746 4.9159C16.3746 4.76123 16.3147 4.6129 16.2081 4.50353C16.1014 4.39417 15.9567 4.33272 15.8059 4.33272ZM10.1186 3.16636H11.256C11.6088 3.1668 11.9528 3.27913 12.2409 3.48795C12.5289 3.69677 12.7469 3.99185 12.865 4.33272H8.50964C8.6277 3.99185 8.84571 3.69677 9.13376 3.48795C9.42181 3.27913 9.76581 3.1668 10.1186 3.16636ZM14.0997 13.0804C14.0997 13.5444 13.9199 13.9894 13.6 14.3175C13.28 14.6456 12.846 14.83 12.3935 14.83H8.98112C8.52861 14.83 8.09463 14.6456 7.77466 14.3175C7.45468 13.9894 7.27493 13.5444 7.27493 13.0804V5.49908H14.0997V13.0804Z"
            fill="#00538E"
          />
          <path
            d="M9.68472 12.664C9.86218 12.664 10.0324 12.6025 10.1578 12.4932C10.2833 12.3838 10.3538 12.2355 10.3538 12.0808V8.58172C10.3538 8.42705 10.2833 8.27871 10.1578 8.16934C10.0324 8.05998 9.86218 7.99854 9.68472 7.99854C9.50727 7.99854 9.33708 8.05998 9.2116 8.16934C9.08612 8.27871 9.01562 8.42705 9.01562 8.58172V12.0808C9.01562 12.2355 9.08612 12.3838 9.2116 12.4932C9.33708 12.6025 9.50727 12.664 9.68472 12.664Z"
            fill="#00538E"
          />
          <path
            d="M11.6925 12.664C11.87 12.664 12.0402 12.6025 12.1657 12.4932C12.2911 12.3838 12.3616 12.2355 12.3616 12.0808V8.58172C12.3616 8.42705 12.2911 8.27871 12.1657 8.16934C12.0402 8.05998 11.87 7.99854 11.6925 7.99854C11.5151 7.99854 11.3449 8.05998 11.2194 8.16934C11.0939 8.27871 11.0234 8.42705 11.0234 8.58172V12.0808C11.0234 12.2355 11.0939 12.3838 11.2194 12.4932C11.3449 12.6025 11.5151 12.664 11.6925 12.664Z"
            fill="#00538E"
          />
        </svg>
      </div>
    </div>
  );
};

export default CityCard;
