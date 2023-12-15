//libs
import { useState, FC } from "react"
//styles 
import styles from "./ProfitCell.module.scss"

const ProfitCell: FC<{ value: string | number, className?: "title" }> = ({ value }) => {
    const [isPicked, setIsPicked] = useState<boolean>(false)
    return (
        <div style={{ backgroundColor: isPicked ? '#6facd8' : '', color: isPicked ? '#ffffff' : '' }} onClick={() => setIsPicked(prev => !prev)} className={`${styles.cell}`}>
            {value}
        </div>
    )
}

export default ProfitCell