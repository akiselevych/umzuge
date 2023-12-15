import { FC } from "react"
import styles from "./OfferOverview.module.scss"
import classNames from "classnames"
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"
import Select from "react-select"
import { IOffer } from "types/offers"
import { ILead } from "types/tables"
import { handleNumberInputChange } from "utils/handelNumberInputChange"
import { OfferInputsType } from "./OfferOverview"

type PropsType = {
  customers: ILead[]
  offer: IOffer | undefined
  isAdding?: boolean
  errors: FieldErrors<OfferInputsType>
  control: Control<OfferInputsType, any>
  register: UseFormRegister<OfferInputsType>
  setValue: UseFormSetValue<OfferInputsType>
  watchFields: OfferInputsType
  setIsLeadModalOpen: (value: boolean) => void
}

export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "2px 4px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 100,
    maxHeight: "140px", // Set the maximum height of the dropdown menu
  }),
  menuList: (provided: any) => ({
    ...provided,
    zIndex: 100,
    maxHeight: "140px", // Match the maxHeight of the menu
    overflowY: "auto", // Add scroll if options exceed maxHeight
  }),
}

const LeftInputs: FC<PropsType> = ({
  customers,
  offer,
  isAdding,
  errors,
  control,
  register,
  watchFields,
  setIsLeadModalOpen,
}) => {
  const inputsNames = {
    Preis: "price",
    Startadresse: "start_address",
    Endadresse: "end_address",
  }

  const LeftInputs = Object.keys(inputsNames).map((n, i) => (
    <div
      key={i}
      className={
        errors[inputsNames[n as keyof typeof inputsNames] as keyof OfferInputsType]
          ? classNames(styles.group, styles.error)
          : styles.group
      }
    >
      <input
        className={styles.input}
        type="text"
        {...register(inputsNames[n as keyof typeof inputsNames] as any, {
          required: inputsNames[n as keyof typeof inputsNames] !== "notes",
        })}
        disabled={!isAdding}
        onKeyDown={
          inputsNames[n as keyof typeof inputsNames] === "price"
            ? handleNumberInputChange
            : undefined
        }
      />
      <span
        className={
          watchFields[
            inputsNames[n as keyof typeof inputsNames] as keyof OfferInputsType
          ]
            ? classNames(styles.span, styles.active)
            : styles.span
        }
      >
        {n}
      </span>
    </div>
  ))

  const customersOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.first_name} ${c.last_name}`,
  }))
  const defaultCustomerValue = customersOptions.find(
    (o) => o.value === offer?.customer.id
  )

  return (
    <>
      <div className={styles.leftInputs}>
        {isAdding ? (
          <div className={styles.group}>
            <div
              className={
                errors.customer
                  ? classNames(styles.select, styles.error)
                  : styles.select
              }
            >
              <span
                className={
                  watchFields["customer"]
                    ? classNames(styles.span, styles.active)
                    : classNames(styles.span, styles.hidden)
                }
                style={{ backgroundColor: "inherit" }}
              >
                Name des Kunden
              </span>
              <Controller
                name="customer"
                control={control}
                defaultValue={defaultCustomerValue as any}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    defaultInputValue={defaultCustomerValue?.value as any}
                    options={customersOptions}
                    placeholder="Name des Kunden"
                    isDisabled={!!offer}
                    {...field}
                    styles={selectStyles}
                  />
                )}
              />
              {!!offer && (
                <div className={styles.disabledLable}>
                  {defaultCustomerValue?.label}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.customer}>
            Kunde:
            <button
              type="button"
              className={styles.customerButton}
              onClick={() => setIsLeadModalOpen(true)}
            >
              {offer?.customer.first_name
                ? `${offer.customer.first_name} ${offer.customer.last_name}`
                : "-"}
            </button>
          </div>
        )}
        {LeftInputs}
        {!isAdding && (
          <div
            className={classNames(
              styles.group,
              errors.follow_up_date && styles.follow_up_date
            )}
          >
            <input
              className={styles.input}
              type="date"
              {...register("follow_up_date")}
            />
            <span className={classNames(styles.span, styles.active)}>
              Follow Up Datum
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default LeftInputs
