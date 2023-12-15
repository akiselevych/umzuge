import { FC } from "react"
import styles from "./LeadCalculator.module.scss"
import InputMUI from "components/InputMUI/InputMUI"
import { useForm } from "react-hook-form"
import { CalculatorFields, calculateResults, calculatorStartData } from "./leadCalculatorHelpers"
import useCalculatorFieldComponents from "./useCalculatorFieldComponents"
import withEuroSymbol from "utils/withEuroSymbol"

const LeadCalculator: FC = () => {
  const { register, watch, handleSubmit, setValue } = useForm<CalculatorFields>({
    defaultValues: calculatorStartData,
  })
  const watchAllFields = watch()

  function submitHandler(data: CalculatorFields) {
    const results = calculateResults(data)

    setValue("totalCosts", results.totalCosts)
    setValue("netPrice", results.netPrice)
    setValue("grossPrice", results.grossPrice)
  }

  const { MappedGridFields, MappedButtonRowFields, MappedResultFields } =
    useCalculatorFieldComponents({ register, watchAllFields })

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(submitHandler)} className={styles.content}>
        <h1 className="modalTitle" style={{ margin: 0 }}>
          Langstrecke
        </h1>

        {/* calculator block */}
        <div className={styles.fieldsGroup}>
          {withEuroSymbol(
            <InputMUI
              type="number"
              register={register}
              watchFields={watchAllFields}
              label="Fixkosten"
              name="fixedCost"
            />
          )}
        </div>
        <div className={styles.fieldsGroup}>{MappedGridFields}</div>
        <div className={styles.fieldsGroup} style={{ gridTemplateColumns: "1fr 1fr 90px" }}>
          {MappedButtonRowFields}
          <button type="submit" className={styles.submitButton}>
            Berechnen
          </button>
        </div>

        {/* results block */}
        <h1 className="modalTitle" style={{ margin: 0 }}>
          Ergebnis
        </h1>
        <div className={styles.fieldsGroup} style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
          {MappedResultFields}
        </div>
      </form>
    </div>
  )
}

export default LeadCalculator
