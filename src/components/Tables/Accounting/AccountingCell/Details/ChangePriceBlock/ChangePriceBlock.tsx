import { FC, useState } from "react"
import classNames from "classnames"
import styles from "./ChangePriceBlock.module.scss"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import editIcon from "assets/icons/EditInSquare.svg"
import checkMarkIcon from "assets/icons/check-mark.svg"
import { useDispatch } from "react-redux"
import { AppDispatch } from "types/index"
import { editContract, editOffer } from "reduxFolder/slices/Table.slice"
import { IContract } from "types/tables"
import { IOffer } from "types/offers"

type PropsType = {
  itemType: "offer" | "contract"
  id: number
  initialPrice: number | null
  initialComment: string
}

const ChangePriceBlock: FC<PropsType> = (props) => {
  const { id, itemType, initialPrice, initialComment } = props

  const dispatch = useDispatch<AppDispatch>()

  const [isError, setIsError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isCommentActive, setIsCommentActive] = useState(!!initialComment)

  const [price, setPrice] = useState<number | string>(
    initialPrice ? initialPrice.toString().split(".")[0] : ""
  )
  const [comment, setComment] = useState(initialComment)

  async function handleSubmit() {
    if (!price) {
      setIsError(true)
      return
    }
    setIsError(false)

    const newData: Partial<IOffer | IContract> = {
      price: price.toString(),
      paid_comment: comment,
    }

    if (itemType === "offer") {
      await dispatch(editOffer({ id, data: newData }))
    } else {
      await dispatch(editContract({ id, data: newData }))
    }

    setIsEditing(false)
  }

  function handleBlur() {
    if (comment.length === 0) {
      setIsCommentActive(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContent}>
        <div className={styles.row}>
          <div className={styles.name}>Preis:</div>
          <div className={styles.value} style={{ height: 20 }}>
            {isError && (
              <span style={{ color: "red", marginRight: 12 }}>
                Preis ist erforderlich!
              </span>
            )}
            {isEditing ? (
              <input
                type="text"
                className={styles.priceInput}
                value={price}
                onKeyDown={handleNumberInputChange}
                onChange={(e) => setPrice(+e.target.value)}
              />
            ) : (
              <span className={styles.priсeValue}>{price}</span>
            )}
            <span className={styles.priсeValue}>
              {price || isEditing ? " €" : "-"}
            </span>
          </div>
        </div>

        <div className={styles.commentBlock}>
          <textarea
            className={styles.comment}
            onFocus={() => setIsCommentActive(true)}
            onBlur={handleBlur}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!isEditing}
          />
          <span
            className={classNames(styles.label, isCommentActive && styles.active)}
          >
            Kommentar
          </span>
        </div>
      </div>
      <div className={styles.buttonBlock}>
        {isEditing ? (
          <button onClick={handleSubmit} className={styles.confirmButton}>
            <img src={checkMarkIcon} alt="confirm" />
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            <img src={editIcon} alt="edit" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ChangePriceBlock
