//styles
import styles from "./index.module.scss";
import general from "components/Marketing/Vacancies/index.module.scss";
//redux
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchVacancies } from "reduxFolder/slices/marketingVacancies.slice";
//libs
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
//components
import ImageUploader from "components/ImageUploader/ImageUploader";
//types
import classNames from "classnames";
import { AppDispatch, RootStateType } from "types/index";
import {
  createEmployee,
  fetchEmployees,
  updateEmployee,
} from "reduxFolder/slices/marketingEmployees.slice";
import { id } from "date-fns/locale";

type Inputs = {
  name: string;
  position: string;
  image: File | string;
};

const EmployeesForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");
  const employeeAddNew = searchParams.get("employeeAddNew");

  const employees = useSelector(
    (state: RootStateType) => state.marketingEmployees.employees
  );
  const employeesResponse = useSelector(
    (state: RootStateType) => state.marketingEmployees.employeesResponse
  );
  const fetchEmployeesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingEmployees.fetchEmployeesLoadingStatus
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      position: "",
      image: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  const createEmployeesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingEmployees.createEmployeesLoadingStatus
  );
  const updateEmployeesLoadingStatus = useSelector(
    (state: RootStateType) =>
      state.marketingEmployees.updateEmployeesLoadingStatus
  );

  if (
    employees &&
    fetchEmployeesLoadingStatus === "idle" &&
    employeeId &&
    !employeeAddNew &&
    !employees.some((vac) => vac.id.toString() === employeeId)
  ) {
    navigate("not-found");
  }

  useEffect(() => {
    if (employeeId && !employeesResponse) {
      dispatch(fetchEmployees());
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const editEmployee = employees.find(
      (item) => item.id === Number(employeeId)
    );

    if (editEmployee) {
      setValue("name", editEmployee.name);
      setValue("position", editEmployee.position);
      // setValue("meta_description", editVacancy.meta_description)
    }
    //eslint-disable-next-line
  }, [employees, employeeId, employeesResponse]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (employeeAddNew && !employeeId) {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("position", data.position);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      dispatch(createEmployee(formData)).then(() => {
        reset();
        const query = new URLSearchParams();
        query.delete("employeeId");
        query.delete("employeeAddNew");

        navigate({
          pathname: window.location.pathname,
          search: query.toString(),
        });
      });
    }
    if (employeeId && !employeeAddNew) {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("position", data.position);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      dispatch(
        updateEmployee({
          id: Number(employeeId),
          data: formData,
        })
      ).then(() => {
        reset();
        const query = new URLSearchParams();
        query.delete("employeeAddNew");
        query.delete("employeeId");

        navigate({
          pathname: window.location.pathname,
          search: query.toString(),
        });
      });
    }
  };

  const submitBtnValue =
    createEmployeesLoadingStatus === "loading" ||
      updateEmployeesLoadingStatus === "loading"
      ? "Loading..."
      : "Add";

  const editEmployee = employees.find((item) => item.id === Number(employeeId));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.conatiner}>
      <div className={styles.leftCol}>
        <div className={styles.inputBlock}>
          <span>Title*</span>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <input type="text" {...field} />}
          />
          {errors.name && (
            <span className={styles.error}>This field is required</span>
          )}
        </div>
        <div className={styles.inputBlock}>
          <span>Position*</span>
          <Controller
            name="position"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <input type="text" {...field} />}
          />
          {errors.position && (
            <span className={styles.error}>This field is required</span>
          )}
        </div>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.inputBlock}>
          <span>Image*</span>
          <Controller
            name="image"
            control={control}
            rules={{ required: true }}
            defaultValue={editEmployee?.image || ""}
            render={({ field }) => (
              <>
                <ImageUploader
                  id={Number(employeeId)}
                  width={166}
                  height={166}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                      e.target instanceof HTMLInputElement &&
                      e.target.files
                    ) {
                      const file = e.target.files[0];
                      field.onChange(file);
                    }
                  }}
                  src={
                    field.value instanceof Blob
                      ? URL.createObjectURL(field.value)
                      : editEmployee?.image || ""
                  }
                />
              </>
            )}
          />
          {errors.image && (
            <span className={styles.error}>This field is required</span>
          )}
          <input
            type="submit"
            value={submitBtnValue}
            className={classNames(general.primaryButton, styles.submitBtn)}
          />
        </div>
      </div>
    </form>
  );
};

export default EmployeesForm;
