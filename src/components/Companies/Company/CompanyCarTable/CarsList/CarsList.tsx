//libs
import { FC } from "react";
import { useDispatch } from "react-redux";
//components
import CarTableItem from "../CarTableItem/CarTableItem";
//redux
import { editCompany } from "reduxFolder/slices/Table.slice";
//styles
import styles from "./CarsList.module.scss";
//types
import { AppDispatch } from "types";

interface Props {
  cars: {
    id: string | number,
    name: string,
    wage: string
  }[],
  companyId: string | number
}


const CarsList: FC<Props> = ({ cars, companyId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const onUpdateList = (id: string | number, data: {
    name: string,
    wage: string
  }) => {
    const updatedList = cars.map((car) => {
      if (car.id === id) {
        return {
          ...car,
          ...data
        }
      }
      return car
    })
    dispatch(editCompany({
      id: companyId,
      data: {
        cars_info: updatedList
      }
    }))
  }



  return (
    <>
      <ul className={styles.tableList}>
        <li className={styles.tableListItem}>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Namen
          </p>
          <p
            className={`${styles.cellTitle} ${styles.tableListCell}`}
          >
            Tagessatz
          </p>
        </li>
        {cars.map((car) => (
          <CarTableItem
            onUpdateList={onUpdateList}
            name={car.name}
            wage={car.wage}
            id={car.id}
            key={car.id}
          />
        ))}
      </ul>
    </>
  );
};

export default CarsList;
