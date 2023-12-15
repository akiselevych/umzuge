import { FC } from "react"
import styles from "./LoadingPage.module.scss"
import logo from "assets/images/Logo.svg"
import truckImage from "assets/images/truck.svg"

const LoadingPage: FC = () => {
  return (
    <div className={styles.loadingPage}>
      <img src={logo} className={styles.logo} alt="logo" />
      <div className={styles.loadingImage}>
        <img src={truckImage} alt="loading" />
      </div>
      <div>
        <h1>Wird geladen...</h1>
        <p>Bitte warten</p>
      </div>
    </div>
  )
}

export default LoadingPage
