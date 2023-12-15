//components
import ClientReviewsCard from "../ClientReviewsCard/ClientReviewsCard";
import ClientReviewsForm from "../ClientReviewsForm/ClientReviewsForm";
import ClientReviewsWrapper from "../ClientReviewsWrapper/ClientReviewsWrapper";
//redux
import {
  fetchCustomerReviews,
  updateCustomerReviewOrder,
} from "reduxFolder/slices/marketingClientReviews.slice";
import { useDispatch, useSelector } from "react-redux";
//livs
import { useEffect, FC, useCallback } from "react";
//styles
import styles from "./index.module.scss";
//types
import { AppDispatch, RootStateType } from "types/index";
import { ICustomerReview } from "types/marketing";

type Props = {
  isFormOpen: boolean;
  onCloseForm: () => void;
  currPage: ICustomerReview["page_name"];
};

const ClientReviewsList: FC<Props> = ({ isFormOpen, onCloseForm, currPage }) => {
  const customerReviews = useSelector(
    (state: RootStateType) => state.marketingClientReviews.customerReviews
  );
  const fetchCustomerReviewsLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingClientReviews.fetchCustomerReviewsLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCustomerReviews());
    //eslint-disable-next-line
  }, []);

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = customerReviews.find((item) => item.order === dragOrder);
      const hoverItem = customerReviews.find(
        (item) => item.order === hoverOrder
      );

      if (dragItem && hoverItem) {
        dispatch(
          updateCustomerReviewOrder({
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
    [customerReviews]
  );

  const content =
    customerReviews && fetchCustomerReviewsLoadingStatus === "idle"
      ? customerReviews.filter(item => item.page_name === currPage).map((item, index) => (
        <ClientReviewsWrapper moveItem={moveItem} review={item} key={item.id}>
          <ClientReviewsCard key={index} {...item} />
        </ClientReviewsWrapper>
      ))
      : null;
  const error =
    fetchCustomerReviewsLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchCustomerReviewsLoadingStatus === "error" ? <p>error...</p> : null;
  return (
    <div className={styles.vacanciesList}>
      {isFormOpen && <ClientReviewsForm  {...{ onCloseForm, page_name: currPage }} />}
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default ClientReviewsList;
