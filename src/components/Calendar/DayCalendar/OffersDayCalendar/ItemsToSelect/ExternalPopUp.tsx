import InputMUI from "components/InputMUI/InputMUI"
import { FC } from "react"
import { Controller, useForm, UseFormSetValue } from "react-hook-form"
import styles from "./ItemsToSelect.module.scss"
import "styles/index.scss"
import Select from "react-select"
import classNames from "classnames"
import {
  IOfferExternalCar,
  OfferFieldsCourierType,
  OfferFieldsType,
} from "types/offers"
import { useSelector } from "react-redux"
import { RootStateType } from "types"
import { v1 } from "uuid"
import { ExternalWorkersType } from "types/calendar"

type PropsType = {
  type: "worker" | "car"
  setIsOpen: (value: boolean) => void
  couriers?: OfferFieldsCourierType[]
  setValue: UseFormSetValue<OfferFieldsType>
  externalCars?: IOfferExternalCar[]
  isTask?: boolean
}

type FieldsType = {
  company: { value: number; label: string }
  category: { value: string; label: string }
  notes: string
}

export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "4px 4px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    maxHeight: "110px",
    zIndex: 10,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "110px",
    overflowY: "auto",
    zIndex: 10,
  }),
}
const stylesSelect = {
  control: (provided: any) => ({
    ...provided,
    padding: "4px 4px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    maxHeight: "140px",
    zIndex: 10,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "140px",
    overflowY: "auto",
    zIndex: 10,
  }),
}

export const workerTypeDictionary = {
  "specialist/carrier": "Fachkraft/Träger",
  assembler: "Monteur",
  "truck driver 3,5t": "LKW Fahrer 3,5t",
  "truck driver from 7,5t": "LKW Fahrer ab 7,5t",
  Other: "Sonstiges",
}

const workersOptions: { value: ExternalWorkersType; label: string }[] = [
  { value: "specialist/carrier", label: "Fachkraft/Träger" },
  { value: "assembler", label: "Monteur" },
  { value: "truck driver 3,5t", label: "LKW Fahrer 3,5t" },
  { value: "truck driver from 7,5t", label: "LKW Fahrer ab 7,5t" },
  { value: "Other", label: "Sonstiges" },
]
export const carsOptions = [
  { value: "LKW 3,5t", label: "LKW 3,5t" },
  { value: "LKW 7,5t", label: "LKW 7,5t" },
  { value: "LKW 12t", label: "LKW 12t" },
  { value: "LKW 18t", label: "LKW 18t" },
  { value: "LKW 40t Sattelzug", label: "LKW 40t Sattelzug" },
  { value: "Möbellift", label: "Möbellift" },
]

const ExternalPopUp: FC<PropsType> = ({
  type,
  setIsOpen,
  couriers,
  setValue,
  externalCars,
  isTask,
}) => {
  const companies = useSelector((state: RootStateType) => state.Table.companies)

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FieldsType>()

  const watchField = watch()

  async function onSubmit(data: FieldsType) {
    if (type === "worker") {
      setValue("couriers", [
        ...(couriers ?? []),
        {
          id: v1(),
          type: data.category.value,
          company_id: data.company.value,
          isExternal: true,
          notes: data.notes,
        } as any,
      ])
    } else {
      setValue(isTask ? "car" : "external_cars", [
        ...(externalCars ?? []),
        {
          id: v1(),
          type: data.category.value,
          company: data.company.value,
          is_external: true,
        },
      ])
    }

    setIsOpen(false)
  }

  const companiesOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }))

  return (
    <div className={styles.externalPopUp}>
      <h1 className="modalTitle">
        {type === "worker" ? "Freie  Mitarbeiter" : "Freie LKW"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.group}>
          <div className={classNames(styles.select, errors.company && styles.error)}>
            <span className={classNames(styles.span, styles.active)}>Firma</span>
            <Controller
              name="company"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={companiesOptions}
                  placeholder="Select..."
                  {...field}
                  styles={stylesSelect}
                />
              )}
            />
          </div>
        </div>

        <div className={styles.group}>
          <div
            className={classNames(styles.select, errors.category && styles.error)}
          >
            <span className={classNames(styles.span, styles.active)}>
              {type === "worker"
                ? "Kategorien von Arbeitnehmern"
                : "Kategorien von LKW"}
            </span>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={type === "worker" ? workersOptions : carsOptions}
                  placeholder="Select..."
                  {...field}
                  styles={stylesSelect}
                />
              )}
            />
          </div>
        </div>

        {type === "worker" && (
          <InputMUI
            label="Notizen"
            name="notes"
            register={register}
            type="text"
            watchFields={watchField}
          />
        )}

        <button disabled={isSubmitting}>Speichern</button>
      </form>
    </div>
  )
}

export default ExternalPopUp
