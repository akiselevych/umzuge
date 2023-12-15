import { leadsHeadersNames } from "components/Tables/Leads/LeadsTable"
import { FC } from "react"
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form"
import styles from "./LeadOverview.module.scss"
import Select from "react-select"
import { ILead } from "types/tables"
import classNames from "classnames"

export const platformOptions = [
  { value: "B2C", label: "B2C" },
  { value: "B2B", label: "B2B" },
  { value: "Umzugspreis", label: "Umzugspreis" },
  { value: "365", label: "365" },
  { value: "Telefon", label: "Telefon" },
  { value: "E-Mail", label: "E-Mail" },
]

type PropsType = {
  lead?: ILead
  field: keyof typeof leadsHeadersNames
  register: UseFormRegister<any>
  control: Control<any, any>
  watchAllFields: any
  errors: FieldErrors<any>
}

const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "4px 4px",
    // height: "46px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-5, #e0e0e0)",
    "&:hover": {
      border: "1px solid var(--gray-5, #e0e0e0)",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    maxHeight: "150px",
    zIndex: 10,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "150px",
    overflowY: "auto",
    zIndex: 10,
  }),
  valueContainer: (provided: any) => ({
		width: "100%",
    display: "flex",
    flex: 1,
    padding: "2px 8px",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "30px",
  }),
	singleValue: (provided: any) => ({
		...provided,
		width: "100%",
	}),
	placeholder: (provided: any) => ({
		...provided,
		width: "100%",
		whiteSpace: "nowrap",
	}),
}

const TextInput: FC<PropsType> = ({
  lead,
  field,
  register,
  errors,
  watchAllFields,
  control,
}) => {
  const defaultPlatformValue = platformOptions.find(
    (p) => p.value === lead?.platform
  )

  return (
    <div
      className={
        errors[leadsHeadersNames[field as keyof typeof leadsHeadersNames]]
          ? classNames(styles.group, styles.error)
          : styles.group
      }
    >
      {field !== "Plattform" ? (
        <input
          type={
            field === "Follow Up Datum" ||
            field === "Erstkontaktversuch" ||
            field === "Lead erhalten"
              ? "date"
              : "text"
          }
          {...register(leadsHeadersNames[field as keyof typeof leadsHeadersNames], {
            required:
              field === "Nachname" ||
              field === "Vorname" ||
              field === "E-Mail" ||
              field === "Telefonnummer",
          })}
          disabled={lead?.status === "Arranged"}
        />
      ) : (
        <Controller
          name="platform"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              options={platformOptions}
              defaultValue={defaultPlatformValue}
              placeholder={"Wählen Sie eine Plattform"}
              {...field}
              styles={selectStyles}
              isSearchable={false}
              isDisabled={lead?.status === "Arranged"}
            />
          )}
        />
      )}
      <span
        className={
          watchAllFields[
            leadsHeadersNames[field as keyof typeof leadsHeadersNames]
          ] ||
          field === "Follow Up Datum" ||
          field === "Erstkontaktversuch" ||
          field === "Plattform" ||
          field === "Lead erhalten"
            ? styles.active
            : undefined
        }
        style={lead?.status === "Arranged" ? { background: "none" } : {}}
      >
        {field}
      </span>
    </div>
  )
}

export default TextInput
