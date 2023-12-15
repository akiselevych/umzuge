//components
import FaqCard from "../FaqCard/FaqCard";
import FaqForm from "../FaqForm/FaqForm";
import FaqWrapper from "../FaqWrapper/FaqWrapper";
//redux
import {
  fetchFaq,
  updateFaqOrder,
} from "reduxFolder/slices/marketingFAQ.slice";
import { useDispatch, useSelector } from "react-redux";
//livs
import { useEffect, FC, useCallback } from "react";
//styles
import styles from "./index.module.scss";
//types
import { AppDispatch, RootStateType } from "types/index";
import { IFaq } from "types/marketing";

type Props = {
  isFormOpen: boolean;
  onCloseForm: () => void;
  currPage: IFaq["page_name"];
};

const FaqList: FC<Props> = ({ isFormOpen, onCloseForm, currPage }) => {
  const faq = useSelector((state: RootStateType) => state.marketingFAQ.faq);
  const fetchCustomerReviewsLoadingStatus = useSelector(
    (state: RootStateType) => state.marketingFAQ.fetchFaqLoadingStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFaq());
    //eslint-disable-next-line
  }, []);

  const moveItem = useCallback(
    (dragOrder: number, hoverOrder: number) => {
      const dragItem = faq.find((item) => item.order === dragOrder);
      const hoverItem = faq.find((item) => item.order === hoverOrder);

      if (dragItem && hoverItem) {
        dispatch(
          updateFaqOrder({
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
    [faq]
  );

  const content =
    faq && fetchCustomerReviewsLoadingStatus === "idle"
      ? faq.filter(item => item.page_name === currPage).map((faq, index) => (
        <FaqWrapper faq={faq} moveItem={moveItem} key={faq.id}>
          <FaqCard number={index + 1} key={index} {...faq} />
        </FaqWrapper>
      ))
      : null;
  const error =
    fetchCustomerReviewsLoadingStatus === "error" ? <p>loading...</p> : null;
  const spinner =
    fetchCustomerReviewsLoadingStatus === "error" ? <p>error...</p> : null;
  return (
    <div className={styles.vacanciesList}>
      {isFormOpen && <FaqForm {...{ onCloseForm, page_name: currPage }} />}
      {content}
      {error}
      {spinner}
    </div>
  );
};

export default FaqList;
