import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchPages,
  updateWebPage,
} from "reduxFolder/slices/marketingWebPage.slice";
//types
import { RootStateType, AppDispatch } from "types/index";
//styles
import styles from "./index.module.scss";
import TableRow from "./TableRow/TableRow";

const ContentTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pages = useSelector(
    (state: RootStateType) => state.marketingWebPage.pages
  );
  const currentPageName = useSelector(
    (state: RootStateType) => state.marketingWebPage.currentPageName
  );
  const loadinfStatus = useSelector(
    (state: RootStateType) => state.marketingWebPage.fetchPagesLoadingStatus
  );

  useEffect(() => {
    dispatch(fetchPages());
    //eslint-disable-next-line
  }, []);

  const content = pages.find(
    (page) => page.page_name === currentPageName
  )?.content;

  const loading =
    loadinfStatus === "loading" ? (
      <p className={styles.message}>Loading...</p>
    ) : null;
  const error =
    loadinfStatus === "error" ? <p className={styles.message}>Error</p> : null;

  const currentWebPage = pages.find(
    (page) => page.page_name === currentPageName
  );

  const onUpdate = (data: [string, string]) => {
    if (currentWebPage) {
      dispatch(
        updateWebPage({
          id: currentWebPage?.id,
          data: {
            content: {
              [data[0]]: data[1],
            },
          },
        })
      );
    }
  };

  return (
    <ul className={styles.table}>
      <li className={styles.titleRow}>
        <p>Name</p>
        <p>Text</p>
      </li>

      {content ? (
        Object.entries(content).map((item, i) => (
          <TableRow key={i} onUpdate={onUpdate} data={item} />
        ))
      ) : (
        <p className={styles.message}>Page not found</p>
      )}
      {content && !Object.entries(content).length && (
        <p className={styles.message}>List are empty</p>
      )}
      {loading}
      {error}
    </ul>
  );
};

export default ContentTable;
