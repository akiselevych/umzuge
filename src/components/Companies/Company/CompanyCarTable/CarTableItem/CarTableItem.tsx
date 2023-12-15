//libs
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//hooks
import { useDebounce } from "hooks/useDebounce";
//redux
import { changeExpense } from "reduxFolder/slices/expensesSlice";
//styles
import styles from "./CarTableItem.module.scss";
//types
import { AppDispatch } from "types/index";

interface Props {
  name: string;
  id: string | number;
  wage: string;
  onUpdateList: (id: string | number, data: {
    "name": string
    "wage": string
  }) => void
}

const CarTableItem: FC<Props> = ({ name, wage, id, onUpdateList }) => {
  const [inputName, setInputName] = useState<string>(name);
  const [inputWage, setInputExpense] = useState<string>(wage);
  const debouncedName = useDebounce<string>(inputName, 200);
  const debounceWage = useDebounce<string>(inputWage, 200);

  useEffect(() => {
    if (debouncedName !== name || debounceWage !== wage) {
      onUpdateList(id, {
        name: debouncedName,
        wage: debounceWage,
      })
    }
    // eslint-disable-next-line
  }, [debounceWage, debouncedName]);

  return (
    <li className={styles.tableListItem}>
      <input
        required
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        className={styles.tableListCell}
      />
      <input
        type="text"
        onChange={(e) => setInputExpense(e.target.value)}
        value={inputWage}
        className={styles.tableListCell}
      />
    </li>
  );
};

export default CarTableItem;
