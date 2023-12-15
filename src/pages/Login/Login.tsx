import { FC, useEffect } from "react";
// Libs
import { SubmitHandler, useForm } from "react-hook-form";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getAuthUser, loginUser } from "reduxFolder/slices/User.slice";
// Styles
import styles from "./Login.module.scss";
// Types
import { AppDispatch, RootStateType } from "types";
// Icons
import logo from "assets/images/Logo.svg";
import { useNavigate } from "react-router-dom";
import LoadingPage from "pages/LoadingPage/LoadingPage";

type LoginInputs = {
  FirstName: string;
  LastName: string;
  Password: string;
};

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootStateType) => state.User.user);
  const isLoading = useSelector(
    (state: RootStateType) => state.User.isLoginLoading
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      dispatch(getAuthUser());
    }
  }, [isLoading]);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const { register, handleSubmit } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const userData = {
      username: `${data.FirstName.trim()} ${data.LastName.trim()}`,
      password: data.Password,
    };
    dispatch(loginUser({ userData, dispatch }));
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className={styles.login}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Anmeldung zum System</h1>
          <input
            type="text"
            placeholder="First name"
            {...register("FirstName", { required: true })}
          />
          <input
            type="text"
            placeholder="Last name"
            {...register("LastName", { required: true })}
          />
          <input
            type="password"
            placeholder="Password assigned by us"
            {...register("Password", { required: true })}
          />
          <button>Anmelden</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
