import { FC, useEffect, useRef, useState } from "react"
import styles from "./OfferOverview.module.scss"
import { AdditionalDocumentType, IOffer } from "types/offers"
import { IContract } from "types/tables"
import plusIcon from "assets/icons/plus.svg"
import { API } from "services/API"
import Notification from "components/Notification/Notification"

type PropstType = {
  offer: IOffer | null
  contract: IContract | null
  enableAdding?: boolean
}

const AdditionalPdfButtons: FC<PropstType> = ({ offer, contract, enableAdding }) => {
  const [additionalDocument, setAdditionalDocument] = useState<FileList | null>(null)
  const [isEditNotificationVisible, setIsEditNotificationVisible] = useState(false)

  const [actualOffer, setActualOffer] = useState<IOffer | null>(offer)
  const [actualContract, setActualContract] = useState<IContract | null>(contract)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (additionalDocument?.[0]) {
      submitAdditionalDocument()

      setAdditionalDocument(null)
    }
  }, [additionalDocument])

  const additionalDocuments =
    (actualOffer || actualContract)?.additional_documents.filter(
      (doc) => doc.document !== null
    ) || []

  const Buttons = additionalDocuments.map((doc) => (
    <button key={doc.id} type="button" onClick={() => openPdf(doc.document)}>
      {doc.name}
    </button>
  ))

  async function submitAdditionalDocument() {
    const pdfFile = additionalDocument?.[0]
    if (pdfFile && (offer?.id || contract?.id)) {
      const createResponse: AdditionalDocumentType =
        await API.createAdditionalDocument(offer?.id, contract?.id)
      const uploadResponse = await API.uploadAdditionalDocument(
        createResponse.id,
        pdfFile
      )
      if (uploadResponse.status === 200) setIsEditNotificationVisible(true)
      offer && refreshOffer()
      contract && refreshContract()

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      setAdditionalDocument(files)
    } else {
      setAdditionalDocument(null)
    }
  }

  async function refreshOffer() {
    if (!offer) return
    const response = await API.getOfferById(offer.id)
    setActualOffer(response)
  }
  async function refreshContract() {
    if (!contract) return
    const response = await API.getContractById(contract.id)
    setActualContract(response)
  }

  function openPdf(document: string | null) {
    if (document) {
      window.open(document)
    } else {
      alert("Kein Dokument gefunden")
    }
  }

  return (
    <>
      <div className={styles.additionalButtons}>
        {Buttons}
        {enableAdding && (
          <div className={styles.addFile}>
            <label>
              <div className={styles.pdfTitle}>
                zusätzliches PDF
                <div className={styles.plus}>
                  <img src={plusIcon} alt="add" />
                </div>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                ref={fileInputRef}
              />
            </label>
          </div>
        )}
      </div>

      <div className={styles.notification}>
        <Notification
          isVisible={isEditNotificationVisible}
          setIsvisible={setIsEditNotificationVisible}
          text="Das Dokument wurde erfolgreich geladen"
        />
      </div>
    </>
  )
}

export default AdditionalPdfButtons
