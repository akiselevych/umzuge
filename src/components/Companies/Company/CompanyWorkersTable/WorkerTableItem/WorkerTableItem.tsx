//libs
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//hooks
import { useDebounce } from "hooks/useDebounce";
//redux
import { changeExpense } from "reduxFolder/slices/expensesSlice";
//styles
import styles from "./WorkerTableItem.module.scss";
//types
import { AppDispatch } from "types/index";

interface Props {
  "id": string | number,
  "name": string
  "goingFee": string
  "comingFee": string
  "hourlyWage": string
  onUpdateList: (id: string | number, data: {
    "name": string
    "goingFee": string
    "comingFee": string
    "hourlyWage": string
  }) => void
}


const WorkerTableItem: FC<Props> = ({ name, goingFee, id, comingFee, hourlyWage, onUpdateList }) => {
  const [inputName, setInputName] = useState<string>(name);
  const [inputWage, setInputWage] = useState<string>(hourlyWage);
  const [inputGoingFee, setInputGoingFee] = useState<string>(goingFee);
  const [inputComingFee, setInputComingFee] = useState<string>(comingFee);
  const debouncedName = useDebounce<string>(inputName, 200);
  const debouncedWage = useDebounce<string>(inputWage, 200);
  const debouncedGoingFee = useDebounce<string>(inputGoingFee, 200);
  const debouncedComingFee = useDebounce<string>(inputComingFee, 200);


  useEffect(() => {
    if (debouncedWage !== hourlyWage || debouncedName !== name || debouncedGoingFee !== goingFee || debouncedComingFee !== comingFee) {
      onUpdateList(id, {
        "name": debouncedName,
        "goingFee": debouncedGoingFee,
        "comingFee": debouncedComingFee,
        "hourlyWage": debouncedWage
      })
    }
    // eslint-disable-next-line
  }, [debouncedWage, debouncedComingFee, debouncedGoingFee, debouncedName]);

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
        onChange={(e) => setInputWage(e.target.value)}
        value={inputWage}
        className={styles.tableListCell}
      />
      <input
        type="text"
        onChange={(e) => setInputComingFee(e.target.value)}
        value={inputComingFee}
        className={styles.tableListCell}
      />
      <input
        type="text"
        onChange={(e) => setInputGoingFee(e.target.value)}
        value={inputGoingFee}
        className={styles.tableListCell}
      />
    </li>
  );
};

export default WorkerTableItem;
