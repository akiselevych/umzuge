//redux
import {
  fetchPartners,
  createPartner,
  updatePartnerOrder,
} from "reduxFolder/slices/marketingPartners.slice";
//libs
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
//components
import PartnerCard from "../PartnerCard/PartnerCard";
import PhotoReviewForm from "../PartnerForm/PartnerForm";
import PartnerWrapper from "../PartnerWrapper/PartnerWrapper";
//types
import { AppDispatch, RootStateType } from "types/index";
//styles
import styles from "./index.module.scss";

const PartnersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const partners = useSelector(
    (state: RootStateType) => state.marketingPartners.partners
  );
  const fetchPartnersLoadingStatus = useSelector(
    (state: RootStateType) => state.marketingPartners.fetchPartnersLoadingStatus
  );

  useEffect(() => {
    dispatch(fetchPartners());
    //eslint-disable-next-line
  }, []);

  const onAddNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      dispatch(createPartner(formData));
    }
  };

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = partners.find((item) => item.order === dragOrder);
      const hoverItem = partners.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updatePartnerOrder({
            dragItem: {
              id: dragItem.id,
              order: dragOrder,
            },
            hoverItem: {
              id: hoverItem.id,
              order: hoverOrder,
            },
          })
        );
      }
    },
    //eslint-disable-next-line
    [partners]
  );

  const content =
    partners && fetchPartnersLoadingStatus === "idle" ? (
      <>
        {partners.map((item, index) => (
          <PartnerWrapper moveItem={moveItem} partner={item} key={item.id}>
            <PartnerCard imagesLength={partners.length} key={index} {...item} />
          </PartnerWrapper>
        ))}
        <PhotoReviewForm {...{ onAddNew }} />
      </>
    ) : null;
  const error =
    fetchPartnersLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchPartnersLoadingStatus === "error" ? <p>error...</p> : null;

  return (
    <div className={styles.list}>
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default PartnersList;
