import { FC } from "react"
import styles from "./Page404.module.scss"
import Image404 from "assets/images/404.svg"
import LogoImage from "assets/images/Logo.svg"
import { useNavigate } from "react-router-dom"

const Page404: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page404}>
      <img src={LogoImage} className={styles.logo} alt="logo" />
      <img src={Image404} className={styles.image404} alt="Page404" />
      <div>
        <h1>Seite Nicht Gefunden</h1>
        <p>
          Es tut uns leid, die von Ihnen angeforderte Seite konnte nicht gefunden
          werden. Bitte gehen Sie zurück zur Homepage.
        </p>
        <button onClick={() => navigate("/")}>Nach Hause gehen</button>
      </div>
    </div>
  )
}

export default Page404
