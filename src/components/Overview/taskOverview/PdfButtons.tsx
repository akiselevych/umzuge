import { useState } from "react"
import styles from "./TaskOverview.module.scss"
import { ITask } from "types/calendar"
import plusIcon from "assets/icons/plus.svg"
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { API } from "services/API"

type PropsType<T extends FieldValues> = {
  task?: ITask
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  watchPdfFile: FileList | undefined
  pdfFileRegisterName: keyof T
}

const PdfButtons = <T extends FieldValues>(props: PropsType<T>): JSX.Element => {
  const { task, register, errors, watchPdfFile } = props

  const [isSignatureLoading, setIsSignatureLoading] = useState(false)

  function loadWorksPapierenPDF() {
    if (task?.delivery?.pdf_file) {
      window.open(task.delivery.pdf_file, "_blank")
    } else if (task?.contract?.pdf_file) {
      window.open(task.contract.pdf_file, "_blank")
    } else {
      return alert("Keine pdf-Datei")
    }
  }
  async function loadCourierSignaturePDF() {
    try {
      setIsSignatureLoading(true)
      const response = await API.generateCourierSignature({
        offer_id: task?.delivery?.id,
        contract_id: task?.contract?.id,
        date: task?.date,
      })

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
      URL.revokeObjectURL(url)
    } catch (error: any) {
			console.log(error.message)
      alert("Nicht gefunden")
    } finally {
      setIsSignatureLoading(false)
    }
  }

  return (
    <div className={styles.buttons}>
      {task ? (
        <button type="button" onClick={loadWorksPapierenPDF}>
          Angebot
        </button>
      ) : (
        <div
          className={styles.addFile}
          style={errors.pdf_file ? { borderColor: "red" } : {}}
        >
          <label>
            <div className={styles.pdfTitle}>
              {watchPdfFile && watchPdfFile[0] ? (
                <div>{watchPdfFile[0]?.name}</div>
              ) : (
                <>
                  PDF
                  <div className={styles.plus}>
                    <img src={plusIcon} alt="add" />
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              {...register(props.pdfFileRegisterName as Path<T>, { required: true })}
              accept=".pdf"
            />
          </label>
        </div>
      )}
      {task && (
        <button
          type="button"
          onClick={loadCourierSignaturePDF}
          disabled={isSignatureLoading}
        >
          Abfahrtskontrolle
        </button>
      )}
    </div>
  )
}

export default PdfButtons
