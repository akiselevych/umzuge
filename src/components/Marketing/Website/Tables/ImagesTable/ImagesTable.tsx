import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchPages } from "reduxFolder/slices/marketingWebPage.slice"
//types 
import { RootStateType, AppDispatch } from "types/index"
//styles
import styles from "./index.module.scss"
import TableRow from "./TableRow/TableRow"



const ImagesTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pages = useSelector((state: RootStateType) => state.marketingWebPage.pages)
  const currentPageName = useSelector((state: RootStateType) => state.marketingWebPage.currentPageName)
  const loadinfStatus = useSelector((state: RootStateType) => state.marketingWebPage.fetchPagesLoadingStatus)


  useEffect(() => {
    dispatch(fetchPages())
    //eslint-disable-next-line
  }, [])


  const images = pages.find(page => page.page_name === currentPageName)?.images

  const loading = loadinfStatus === "loading" ? <p className={styles.message}>Loading...</p> : null
  const error = loadinfStatus === "error" ? <p className={styles.message}>Error</p> : null

  return (
    <ul className={styles.table}>
      <li className={styles.titleRow}>
        <p>
          Image
        </p>
        <p>
          Alt text
        </p>
        <p>
          Weight
        </p>
      </li>

      {
        images ? images.map(image => <TableRow key={image.id} {...image} />) :
          <p className={styles.message}>Page not found</p>
      }
      {images && !images.length && <p className={styles.message}>List are empty</p>}
      {loading}
      {error}
    </ul>
  )
}

export default ImagesTable