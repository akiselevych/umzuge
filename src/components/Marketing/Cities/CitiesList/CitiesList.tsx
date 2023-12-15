//redux
import {
  fetchCities,
  createCity,
  updateCityOrder,
} from "reduxFolder/slices/marketingCities.slice";
//libs
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
//components
import CityCard from "../CityCard/CityCard";
import CityForm from "../CityForm/CityForm";
import CityWrapper from "../CityWrapper/CityWrapper";
//types
import { AppDispatch, RootStateType } from "types/index";
//styles
import styles from "./index.module.scss";
// types
import { ICity, ICreateCityPayload } from "types/marketing";

const CitiesList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [localCities, setLocalCities] = useState<ICity[]>([]);
  const [globalCities, setGlobalCities] = useState<ICity[]>([]);

  const cities = useSelector(
    (state: RootStateType) => state.marketingCities.cities
  );

  const fetchPartnersLoadingStatus = useSelector(
    (state: RootStateType) => state.marketingCities.fetchCitiesLoadingStatus
  );

  useEffect(() => {
    dispatch(fetchCities()).then((data) => {
      const local = data.payload.results.filter(
        (item: ICity) => item.relocation_type === "regional"
      );
      const global = data.payload.results.filter(
        (item: ICity) => item.relocation_type === "interregional"
      );

      setGlobalCities(global);
      setLocalCities(local);
    });

    //eslint-disable-next-line
  }, []);

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = cities.find((item) => item.order === dragOrder);
      const hoverItem = cities.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updateCityOrder({
            dragItem: {
              id: dragItem.id,
              order: dragOrder,
            },
            hoverItem: {
              id: hoverItem.id,
              order: hoverOrder,
            },
          })
        ).then((data) => {
          const local = data.payload.filter(
            (item: ICity) => item.relocation_type === "regional"
          );
          const global = data.payload.filter(
            (item: ICity) => item.relocation_type === "interregional"
          );

          setGlobalCities(global);
          setLocalCities(local);
        });
      }
    },
    [cities]
  );

  console.log(localCities);

  const error =
    fetchPartnersLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchPartnersLoadingStatus === "error" ? <p>error...</p> : null;

  const onCreateNew = (
    data: ICreateCityPayload,
    thenCallback: (arg?: any) => void
  ) => {
    dispatch(createCity(data)).then(thenCallback);
  };

  return (
    <div className={styles.list}>
      {error}
      {spinner}
      <div className={styles.leftCol}>
        <h4>Stuttgart region</h4>
        {localCities.map((item, i) => (
          <CityWrapper city={item} moveItem={moveItem} key={i}>
            <CityCard key={i} {...item} />
          </CityWrapper>
        ))}
        <CityForm onCreateNew={onCreateNew} type="regional" />
      </div>
      <div className={styles.rightCol}>
        <h4>Other cities</h4>
        {globalCities.map((item, i) => (
          <CityWrapper city={item} moveItem={moveItem} key={i}>
            <CityCard key={i} {...item} />
          </CityWrapper>
        ))}
        <CityForm onCreateNew={onCreateNew} type="interregional" />
      </div>
    </div>
  );
};

export default CitiesList;
