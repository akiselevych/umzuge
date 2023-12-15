//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss"
import classNames from "classnames";
//conportents
import VacanciesLegend from "components/Marketing/Vacancies/VacanciesLegend/VacanciesLegend";
//redux
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createVacancy, fetchVacancies, updateVacancy } from "reduxFolder/slices/marketingVacancies.slice";
//libs
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, SubmitHandler } from "react-hook-form"
//types
import { ICreateVacancyPayload } from "types/marketing";
import { AppDispatch, RootStateType } from "types/index";

const genders = [
  {
    name: "male",
    value: "m"
  },
  {
    name: "female",
    value: "w"
  },
  {
    name: "other",
    value: "d"
  },
  {
    name: "all",
    value: "m/w/d"
  },
]

const employment_type: {
  name: string,
  value: "office" | "remote" | "hybrid";
}[] = [
    {
      name: "Office",
      value: "office"
    },
    {
      name: "Remote",
      value: "remote"
    },
    {
      name: "Hybrid",
      value: "hybrid"
    }
  ]



const VacancyForm = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vacancyId = searchParams.get('vacancyId');
  const vacancyAddNew = searchParams.get('vacancyAddNew');

  const vacancies = useSelector((state: RootStateType) => state.marketingVacancies.vacancies)
  const vacanciesResponse = useSelector((state: RootStateType) => state.marketingVacancies.vacanciesResponse)
  const fetchVacanciesLoadingStatus = useSelector((state: RootStateType) => state.marketingVacancies.fetchVacanciesLoadingStatus)

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICreateVacancyPayload>({
    defaultValues: {
      gender: genders[0].value,
      employment_type: employment_type[0].value,
      city: "",
      meta_description: "",
      meta_title: "",
      we_offer: "",
      tasks: "",
      profile: "",
      job_title: "",


    }
  })

  const dispatch = useDispatch<AppDispatch>();

  const createVacanciesLoadingStatus = useSelector((state: RootStateType) => state.marketingVacancies.createVacanciesLoadingStatus)
  const updateVacanciesLoadingStatus = useSelector((state: RootStateType) => state.marketingVacancies.updateVacanciesLoadingStatus)


  if (vacancies && fetchVacanciesLoadingStatus === "idle"
    && vacancyId && !vacancyAddNew
    && !vacancies.some(vac => vac.id.toString() === vacancyId)) {
    navigate("not-found")
  }


  useEffect(() => {
    if (vacancyId && !vacanciesResponse) {
      dispatch(fetchVacancies())
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    const editVacancy = vacancies.find((item) => item.id === Number(vacancyId))

    if (editVacancy) {
      setValue("city", editVacancy.city)
      setValue("gender", editVacancy.gender)
      setValue("meta_description", editVacancy.meta_description)
      setValue("meta_title", editVacancy.meta_title)
      setValue("we_offer", editVacancy.we_offer)
      setValue("tasks", editVacancy.tasks)
      setValue("profile", editVacancy.profile)
      setValue("job_title", editVacancy.job_title)
      setValue("employment_type", editVacancy.employment_type)
    }
    //eslint-disable-next-line
  }, [vacancies, vacancyId, vacanciesResponse])

  const onSubmit: SubmitHandler<ICreateVacancyPayload> = (data) => {
    if (vacancyAddNew && !vacancyId) {
      dispatch(createVacancy(data))
        .then(() => {
          reset()
          const query = new URLSearchParams();
          query.delete('vacancyAddNew');
          query.delete('vacancyId');

          navigate({
            pathname: window.location.pathname,
            search: query.toString()
          });
        })
    }
    if (vacancyId && !vacancyAddNew) {
      data.id = Number(vacancyId)
      dispatch(updateVacancy(data))
        .then(() => {
          reset()
          const query = new URLSearchParams();
          query.delete('vacancyAddNew');
          query.delete('vacancyId');

          navigate({
            pathname: window.location.pathname,
            search: query.toString()
          });
        })
    }
  }

  const submitBtnValue = createVacanciesLoadingStatus === "loading" || updateVacanciesLoadingStatus === "loading" ? "Loading..." : "Add"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.conatiner}>
      <div className={styles.leftCol}>
        <div className={styles.inputBlock}>
          <span>Sex*</span>
          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select  {...field}>
                {genders.map((item, i) => <option key={i} value={item.value}>{item.name}</option>)}
              </select>
            )}
          />
          {errors.gender && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Location*</span>
          <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
              />
            )}
          />
          {errors.city && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Position name*</span>
          <Controller
            name="job_title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
              />
            )}
          />
          {errors.job_title && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Vacancy type*</span>
          <Controller
            name="employment_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select  {...field}>
                {employment_type.map((item, i) => <option key={i} value={item.value}>{item.name}</option>)}
              </select>
            )}
          />
          {errors.employment_type && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Your responsibilities*</span>
          <Controller
            name="tasks"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
              />
            )}
          />
          {errors.tasks && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Your profile*</span>
          <Controller
            name="profile"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
              />
            )}
          />
          {errors.profile && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>We offer*</span>
          <Controller
            name="we_offer"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
              />
            )}
          />
          {errors.we_offer && <span className={styles.error}>This field is required</span>}
        </div>
      </div>
      <div className={styles.rightCol}>
        <VacanciesLegend />
        <div className={styles.inputBlock}>
          <span>Meta-title*</span>
          <Controller
            name="meta_title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
              />
            )}
          />
          {errors.meta_title && <span className={styles.error}>This field is required</span>}
        </div>
        <div className={styles.inputBlock}>
          <span>Meta-description*</span>
          <Controller
            name="meta_description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
              />
            )}
          />
          {errors.meta_description && <span className={styles.error}>This field is required</span>}
        </div>
        <input type="submit" value={submitBtnValue} className={classNames(general.primaryButton, styles.submitBtn)} />
      </div>
    </form>
  )
}

export default VacancyForm