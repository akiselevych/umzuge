//styles
import classNames from "classnames";
import styles from "./index.module.scss";
//libs
import { useState, FC } from "react";
//types
import { ICity, ICreateCityPayload } from "types/marketing";
import { useSelector } from "react-redux";
import { RootStateType } from "types/index";
//images
import plus from "assets/icons/plus.circle.svg"
import minus from "assets/icons/minus.circle.svg"

type Props = {
  type: ICity["relocation_type"],
  onCreateNew: (data: ICreateCityPayload, thenCallback: (arg?: any) => void) => void

}


const CityForm: FC<Props> = ({ type, onCreateNew }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const status = useSelector((state: RootStateType) => state.marketingCities.createCitiesLoadingStatus)

  const onSubmit = () => {
    onCreateNew({
      city_name: inputValue,
      relocation_type: type
    }, () => {
      setInputValue('')
      setIsOpen(false)
    })
  }

  const onOpen = () => setIsOpen(prev => !prev)

  const disabled = !inputValue.length || status === 'loading'
  return (
    <div className={styles.wrapper}>
      <div onClick={onOpen} className={styles.openBtn}>
        {
          isOpen ?
            <img src={minus} alt="" />
            : <img src={plus} alt="" />
        }
      </div>
      {
        isOpen &&
        <div className={styles.inputBlock}>
          <input value={inputValue} onChange={e => setInputValue(e.target.value)} type="text" />
          <div onClick={onSubmit} className={classNames(styles.submit, disabled ? styles.disabled : '')}>Add</div>
        </div>
      }
    </div>
  )
}

export default CityForm