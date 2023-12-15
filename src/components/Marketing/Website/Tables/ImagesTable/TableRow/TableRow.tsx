import styles from "./index.module.scss"
//libs
import { useState, FC, useEffect, useRef } from "react"
import { useDebounce } from "hooks/useDebounce"
//rerdux
import { useDispatch, useSelector } from "react-redux"
import { updatePageImage } from "reduxFolder/slices/marketingWebPage.slice"
//types
import { ImageType } from "components/Marketing/Website/types"
import { AppDispatch, RootStateType } from "types/index"
//components
import ImageUploader from "components/ImageUploader/ImageUploader"


const TableRow: FC<ImageType> = ({ image, alt_text, weight, id, web_page }) => {
  const [altInputValue, setAltInputValue] = useState(alt_text)
  const [fileInputValue, setFileInputValue] = useState<File | null>(null)

  const debauncedAltInputValue = useDebounce(altInputValue, 500)
  const inputsChangesCounter = useRef(0)
  const filesChangesCounter = useRef(0)
  const dispatch = useDispatch<AppDispatch>()
  const currentPageName = useSelector((state: RootStateType) => state.marketingWebPage.currentPageName)


  useEffect(() => {
    setAltInputValue(alt_text)
    inputsChangesCounter.current = 0
    //eslint-disable-next-line
  }, [currentPageName])

  useEffect(() => {
    if (inputsChangesCounter.current) {
      const formdata = new FormData()
      formdata.append('alt_text', debauncedAltInputValue)
      formdata.append('web_page', web_page.toString())
      dispatch(updatePageImage({
        id,
        data: formdata
      }))
    }
    //eslint-disable-next-line
  }, [debauncedAltInputValue])



  useEffect(() => {
    if (filesChangesCounter.current) {
      {
        const formdata = new FormData()
        formdata.append('image', fileInputValue as File)
        formdata.append('web_page', web_page.toString())
        dispatch(updatePageImage({
          id,
          data: formdata
        }))
      }
    }
    //eslint-disable-next-line
  }, [fileInputValue])




  return (
    <li className={styles.row}>
      <div className={styles.cell}>
        <ImageUploader
          id={id}
          width={250}
          height={250}
          propForUpdate={Math.random()}
          styles={{
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
          }} src={
            fileInputValue instanceof Blob
              ? URL.createObjectURL(fileInputValue)
              : image || ""
          }
          srcType={fileInputValue instanceof Blob
            ? "file" : "string"}
          cahce={true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (
              e.target instanceof HTMLInputElement &&
              e.target.files
            ) {
              const file = e.target.files[0];
              filesChangesCounter.current++
              setFileInputValue(file);
            }
          }} />
      </div>
      <div className={styles.cell}>
        <textarea value={altInputValue} onChange={e => {
          setAltInputValue(e.target.value)
          inputsChangesCounter.current++
        }} />
      </div>
      <div className={styles.cell}>
        {weight}
      </div>
    </li>
  )
}

export default TableRow