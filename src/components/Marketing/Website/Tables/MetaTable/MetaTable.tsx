import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchPages } from "reduxFolder/slices/marketingWebPage.slice"
//types 
import { RootStateType, AppDispatch } from "types/index"
//redux
import { updateWebPage } from "reduxFolder/slices/marketingWebPage.slice"
//styles
import styles from "./index.module.scss"
import TableRow from "./TableRow/TableRow"



const MetaTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pages = useSelector((state: RootStateType) => state.marketingWebPage.pages)
  const currentPageName = useSelector((state: RootStateType) => state.marketingWebPage.currentPageName)
  const loadinfStatus = useSelector((state: RootStateType) => state.marketingWebPage.fetchPagesLoadingStatus)


  useEffect(() => {
    dispatch(fetchPages())
    //eslint-disable-next-line
  }, [])

  const page = pages.find(page => page.page_name === currentPageName)

  const onUpdate = (value: string, keyName: "meta_description" | "meta_title") => {
    if (page) {
      dispatch(updateWebPage({
        id: page.id,
        data: {
          meta_tags: {
            [keyName]: value
          }
        }
      }))
    }
  }


  const meta = pages.find(page => page.page_name === currentPageName)?.meta_tags

  const loading = loadinfStatus === "loading" ? <p className={styles.message}>Loading...</p> : null
  const error = loadinfStatus === "error" ? <p className={styles.message}>Error</p> : null

  return (
    <ul className={styles.table}>
      <li className={styles.titleRow}>
        <p>
          Meta Teg
        </p>
        <p>
          Content
        </p>
        <p>
          Word Count
        </p>
      </li>
      {meta && meta.meta_title && <TableRow keyName="meta_title" value={meta.meta_title} onUpdate={onUpdate} />}
      {meta && meta.meta_description && <TableRow keyName="meta_description" value={meta.meta_description} onUpdate={onUpdate} />}
      {!meta && <p className={styles.message}>Page not found</p>}
      {loading}
      {error}
    </ul>
  )
}

export default MetaTable