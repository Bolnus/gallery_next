"use client";
import React from "react";
import classes from "./AuthPage.module.scss";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { useTranslations } from "next-intl";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";
import { useMutation } from "react-query";
import { onLoginSuccess, postLoginRequest } from "../lib/authPageUtils";
import { loginMutation } from "../../../shared/api/auth/auth";
import { AuthCredentials, AuthUser } from "../../../shared/api/auth/types";
import { AxiosError, AxiosResponse } from "axios";
import { ApiMessage } from "../../../shared/api/apiTypes";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import { useAuth } from "../../../app/lib/context/authContext";
import { PieIcon } from "../../../shared/ui/icons/PieIcon/PieIcon";
import { Link, useRouter } from "../../../../app/navigation";

export function AuthPage(): JSX.Element {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const intl = useTranslations("AuthPage");
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutate: postAuth, isLoading: isPostAuthLoading } = useMutation<
    AxiosResponse<AuthUser>,
    AxiosError<ApiMessage>,
    AuthCredentials
  >(loginMutation, {
    onError: (localError: AxiosError<ApiMessage>) =>
      setErrorMessage(localError?.response?.data?.message || localError?.message || ""),
    onSuccess: (resp) => onLoginSuccess(resp.data.user, setUser, router),
    retry: false
  });

  React.useEffect(() => setErrorMessage(""), [password, login]);

  return (
    <div className={classes.authPage}>
      <Link className={getUnitedClassnames([classes.imageWrapper, "pushButton"])} href="/">
        <PieIcon />
      </Link>
      <form
        className={classes.authPage__loginForm}
        onSubmit={(localEvent) => postLoginRequest(login, password, postAuth, localEvent)}
      >
        <p className={classes.errorMessage}>{errorMessage}</p>
        <div className={classes.formInput}>
          <label htmlFor="login" className={classes.formInput__label}>
            {intl("loginLabel")}
          </label>
          <TextInput
            value={login}
            onChange={setLogin}
            placeholder={intl("loginPlaceholder")}
            name="login"
            autoComplete="username"
            className={classes.formInput__input}
            isFetching={isPostAuthLoading}
          />
        </div>

        <div className={classes.formInput}>
          <label htmlFor="password" className={classes.formInput__label}>
            {intl("passwordLabel")}
          </label>
          <TextInput
            value={password}
            onChange={setPassword}
            isPassword
            placeholder={intl("passwordPlaceholder")}
            name="password"
            autoComplete="current-password"
            className={classes.formInput__input}
            isFetching={isPostAuthLoading}
          />
        </div>

        <button
          type="submit"
          className={getUnitedClassnames([classes.formSubmit, "pushButton"])}
          disabled={!password || !login}
        >
          <span className={classes.formSubmit__text}>
            {isPostAuthLoading ? <SkeletonLoader /> : intl("enterButton")}
          </span>
        </button>
      </form>
    </div>
  );
}
