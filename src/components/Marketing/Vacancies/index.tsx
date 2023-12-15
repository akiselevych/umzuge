//components
import VacanciesList from "./VacanciesList/VacanciesList";
import VacancyForm from "./VacancyForm/VacancyForm";
//libs
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//styles
import classNames from "classnames";
import styles from "./index.module.scss";
//images
import smallPlus from "assets/icons/smallPlus.svg";

const Vacancies = () => {
  const [searchParams] = useSearchParams();
  const vacancyId = searchParams.get("vacancyId");
  const vacancyAddNew = searchParams.get("vacancyAddNew");
  const navigate = useNavigate();

  const onAdd = () => {
    const query = new URLSearchParams();
    query.set("vacancyAddNew", true.toString());
    query.delete("vacancyId");

    navigate({
      pathname: window.location.pathname,
      search: query.toString(),
    });
  };

  if (vacancyId || vacancyAddNew) return <VacancyForm />;

  return (
    <div className={styles.container}>
      <button
        onClick={onAdd}
        className={classNames(styles.primaryButton, styles.addBtn)}
      >
        Add <img src={smallPlus} />
      </button>
      <VacanciesList />
    </div>
  );
};

export default Vacancies;
