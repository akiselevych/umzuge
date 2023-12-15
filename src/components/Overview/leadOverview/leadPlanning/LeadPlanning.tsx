import { FC, useState } from "react"
import styles from "./LeadPlanning.module.scss"
import { FormProvider, useForm } from "react-hook-form"
import DaysManagement from "./DaysManagement/DaysManagement"
import {
  BothAddressFieldKeys,
  FieldType,
  LeadPlanningFieldsType,
  defaultLeadPlanningValues,
  leadPlanningFieldValuesDict,
  leadPlanningFieldsDict,
  leadPlanningGroupsDict,
} from "./leadPlanningHelpers"
import DayInfo from "./DayInfo/DayInfo"
import InfoManagement from "./InfoManagement/InfoManagement"
import { removeEmptyValues } from "utils/removeEmptyValues"
import moment from "moment"
import classNames from "classnames"

function generateDataValuesText(data: LeadPlanningFieldsType) {
  let resultString = ""
  for (let i = 0; i < data.days_info.length; i++) {
    resultString += `\nTag ${i + 1}\n`
    resultString +=
      data.days_info[i].date && `${moment(data.days_info[i].date).format("DD.MM.YYYY")}\n`

    const loadingAddressInfo = getInfoFromDataGroup(data, "loading_address", i)
    const unloadingAddressInfo = getInfoFromDataGroup(data, "unloading_address", i)

    if (loadingAddressInfo) {
      resultString += `${leadPlanningGroupsDict.loading_address}:\n${loadingAddressInfo} \n`
    }
    if (unloadingAddressInfo) {
      resultString += `${leadPlanningGroupsDict.unloading_address}:\n${unloadingAddressInfo} \n`
    }
  }
  return resultString
}

function getInfoFromDataGroup(
  data: LeadPlanningFieldsType,
  type: "loading_address" | "unloading_address",
  index: number
) {
  let result = ""

  for (let k = 0; k < Object.keys(data.days_info[index][type]).length; k++) {
    const key = Object.keys(data.days_info[index][type])[k]
    const value = Object.values(data.days_info[index][type])[k]
    const notEmptyValues = removeEmptyValues(value)
    if (Object.keys(notEmptyValues).length > 0) {
      result += `${leadPlanningFieldsDict[key as BothAddressFieldKeys]}: `

      Object.entries(notEmptyValues).forEach(([key, value], index, array) => {
        const fieldLabel = leadPlanningFieldValuesDict[key as keyof FieldType]
        const formattedValue = `${fieldLabel}: ${value}`
        if (index < array.length - 1) {
          result += `${formattedValue} | `
        } else {
          result += `${formattedValue}\n`
        }
      })
    }
  }

  return result
}

const LeadPlanning: FC = () => {
  const [notification, setNotification] = useState<"success" | "error" | null>(null)

  const useFormMethods = useForm<LeadPlanningFieldsType>({
    defaultValues: defaultLeadPlanningValues,
  })
  const { handleSubmit } = useFormMethods

  function submitHandler(data: LeadPlanningFieldsType) {
    const resultString = generateDataValuesText(data)
    copyText(resultString)
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setNotification("success")
    } catch (error) {
      console.error("Failed to copy text: ", error)
      setNotification("error")
    }

    setTimeout(() => {
      setNotification(null)
    }, 2000)
  }

  return (
    <>
      <FormProvider {...useFormMethods}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.wrapper}>
          <DaysManagement />
          <DayInfo />
          <InfoManagement />
          <button className={styles.copyTextButton}>Text kopieren</button>
        </form>
      </FormProvider>

      <div
        className={classNames(
          styles.notification,
          !notification && styles.hidden,
          notification === "error" && styles.error
        )}
      >
        {notification === "success"
          ? "Der Text wurde erfolgreich kopiert"
          : "Fehler beim Kopieren des Textes"}
      </div>
    </>
  )
}

export default LeadPlanning
