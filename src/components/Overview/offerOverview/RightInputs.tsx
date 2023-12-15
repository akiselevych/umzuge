import classNames from "classnames"
import { FC, useState } from "react"
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"
import styles from "./OfferOverview.module.scss"
import { ICourier } from "types/tables"
import { IOffer } from "types/offers"
import { OfferInputsType } from "./OfferOverview"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { serverDomain } from "services/API"

type PropsType = {
  errors: FieldErrors<OfferInputsType>
  register: UseFormRegister<OfferInputsType>
  couriers: ICourier[]
  watchFields: OfferInputsType
  offer: IOffer | undefined
  setValue: UseFormSetValue<OfferInputsType>
  control: any
}

const RightInputs: FC<PropsType> = ({
  errors,
  register,
  watchFields,
  offer,
  setValue,
}) => {
  const user = useSelector((state: RootStateType) => state.User.user)
  const [saleManPhoto, setSaleManPhoto] = useState<string | undefined>(
    serverDomain + offer?.sale_man?.image_path
  )

  const [saleManName, setSaleManName] = useState<string | undefined>(
    offer?.sale_man
      ? `${offer?.sale_man?.first_name} ${offer?.sale_man?.last_name}`
      : ""
  )

  function handleSaleManPhotoClick() {
    if (user?.role === "sale_man") {
      if (offer && user) {
        if (!saleManPhoto) {
          setSaleManPhoto(serverDomain + user.image_path)
          setSaleManName(`${user.first_name} ${user.last_name}`)
          setValue("sale_man_id", +user?.id)
        } else {
          setSaleManPhoto(undefined)
          setSaleManName(undefined)
          setValue("sale_man_id", undefined)
        }
      }
    } else {
      alert("only sale man can change this field")
    }
  }

  return (
    <>
      <div className={styles.rightInputs}>
        <div className={styles.group}>
          <div className={errors.delivery_number ? styles.error : ""}>
            <input
              className={styles.input}
              type="text"
							disabled={!!offer}
              {...register("delivery_number", { required: true })}
            />
            <span
              className={
                watchFields.delivery_number
                  ? classNames(styles.span, styles.active)
                  : styles.span
              }
            >
              {"Angebotsnummer"}
            </span>
          </div>
        </div>

        <div className={styles.group}>
          <div className={errors.start_date ? styles.error : ""}>
            <input
              className={styles.input}
              type="date"
              {...register("start_date", { required: true })}
							disabled={!!offer}
							/>
            <span className={classNames(styles.span, styles.active)}>
              {"Startdatum"}
            </span>
          </div>
        </div>

        <div className={styles.group}>
          <div className={errors.end_date ? styles.error : ""}>
            <input
              className={styles.input}
              type="date"
              {...register("end_date", { required: true })}
							disabled={!!offer}
            />
            <span className={classNames(styles.span, styles.active)}>
              {"Enddatum"}
            </span>
          </div>
        </div>

        <div className={classNames(styles.group, errors.notes && styles.error)}>
          <input className={styles.input} type="text" {...register("notes")} />
          <span
            className={
              watchFields.notes
                ? classNames(styles.span, styles.active)
                : styles.span
            }
          >
            Notizen
          </span>
        </div>

        {offer && (
          <div className={styles.saleMan}>
            <div
              className={
                offer?.sale_man
                  ? classNames(styles.saleManPhoto, styles.hiddenBorder)
                  : styles.saleManPhoto
              }
              onClick={handleSaleManPhotoClick}
            >
              <img src={saleManPhoto} />
            </div>
            <span>{saleManName}</span>
          </div>
        )}
      </div>
    </>
  )
}

export default RightInputs
