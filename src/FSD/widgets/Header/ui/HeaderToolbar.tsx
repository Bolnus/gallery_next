"use client";
import React from "react";
import classes from "./HeaderToolbar.module.scss";
import { DarkToggle } from "../../../shared/ui/checkBox/DarkToggle";
import { darkToggleStorageItem } from "../../../shared/lib/storage/localStorageInterface";
import { ReactIcon } from "../../../shared/ui/icons/ReactIcon/ReactIcon";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { useAuth } from "../../../app/lib/context/authContext";
import { SausageButton } from "../../../shared/ui/button/SausageButton/SausageButton";
import { useLocale, useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";
import { useMutation } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiMessage } from "../../../shared/api/apiTypes";
import { logoutMutation } from "../../../shared/api/auth/auth";
import { Modal, ModalType } from "../../../shared/ui/Modal/Modal";
import { useOutsideClick } from "../../../shared/lib/hooks/useOutsideClick";
import { isProtectedPath } from "../../../shared/lib/common/proxyUtils";
import { usePathname, useRouter } from "../../../../app/navigation";
import { RadioList } from "../../../shared/ui/input/Radio/RadioList";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

function updateStyle(toggleState: boolean): void {
  if (toggleState) {
    document.documentElement.style.setProperty("--mainColor", "#112734");
    document.documentElement.style.setProperty("--bgColor", "#021e2a");
    document.documentElement.style.setProperty("--fontColorFirm", "white");
    document.documentElement.style.setProperty("--shadowColor", "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "white");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "#004422");
    document.documentElement.style.setProperty("--fontColorFullGreen", "#80eeb0");
    document.documentElement.style.setProperty("--fontColorLight", "#c4ccce");
    document.documentElement.style.setProperty("--mainColorDark", "#112734");
    document.documentElement.style.setProperty("--inputBgColor", "#112734");
  } else {
    document.documentElement.style.setProperty("--mainColor", "#80eeb0");
    document.documentElement.style.setProperty("--bgColor", "#f5f6fa");
    document.documentElement.style.setProperty("--fontColorFirm", "black");
    document.documentElement.style.setProperty("--shadowColor", "rgba(0, 0, 0, 0.2)");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "#004422");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "grey");
    document.documentElement.style.setProperty("--fontColorFullGreen", "#4ed164");
    document.documentElement.style.setProperty("--fontColorLight", "grey");
    document.documentElement.style.setProperty("--mainColorDark", "#004422");
    document.documentElement.style.setProperty("--inputBgColor", "#c4ccce");
  }
}

function onCheckBoxClicked(setChecked: (flag: boolean) => void, checked: boolean) {
  setChecked(checked);
  updateStyle(checked);
  darkToggleStorageItem.set(String(checked));
}

function onUserButtonClick(
  user: string,
  router: AppRouterInstance,
  pathname: string,
  logout: () => void,
  setPopupOpen: (flag: boolean) => void
) {
  if (user) {
    logout();
  }
  if (pathname === "/auth") {
    setPopupOpen(false);
    return;
  }

  if (!user || isProtectedPath(pathname)) {
    router.push("/auth");
  }
}

function onLangSelect(
  newLocale: string,
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: ReadonlyURLSearchParams
) {
  let fullPath = pathname;
  const searchString = searchParams.toString();
  if (searchString) {
    fullPath = `${pathname}?${searchString}`;
  }
  router.push(fullPath, { locale: newLocale });
}

export function HeaderToolbar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDark, setIsDark] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const { isLoading, user, setUser } = useAuth();
  const intl = useTranslations("AuthPage");
  const locale = useLocale();
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => setPopupOpen(false), [user, pathname]);

  React.useEffect(() => {
    const storageIsDark = darkToggleStorageItem.get() === "true";
    updateStyle(storageIsDark);
    setIsDark(storageIsDark);
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  const { mutate: logout, isLoading: isLogoutLoading } = useMutation<AxiosResponse, AxiosError<ApiMessage>>(
    logoutMutation,
    {
      onError: (localError: AxiosError<ApiMessage>) =>
        setErrorMessage(localError?.response?.data?.message || localError?.message || ""),
      onSuccess: () => setUser("")
    }
  );

  const closePopup = React.useCallback(() => setPopupOpen(false), []);

  useOutsideClick({ ref: popupRef, handler: closePopup, enabled: popupOpen, stopPropagation: true });

  const languageOptions: SelectOption[] = [
    { value: "en", label: intl("enLocale") },
    { value: "ru", label: intl("ruLocale") }
  ];

  return (
    <div className={classes.darkToggleWrapper}>
      <DarkToggle
        isDark={isDark}
        onChange={(flag) => onCheckBoxClicked(setIsDark, flag)}
        className={classes.userButtonSpacing}
      />
      <ButtonIcon
        iconName={user ? IconName.User : IconName.Login}
        color="white"
        size={UiSize.Large}
        onClick={() => setPopupOpen((prev) => !prev)}
        disabled={popupOpen}
        stopPropagation
      />
      {popupOpen && (
        <div ref={popupRef} className={classes.userPopup}>
          {!!user && (
            <div className={getUnitedClassnames([classes.userPopup__userName])}>
              <span className={classes.userPopup__icon}>
                <ReactIcon color="var(--fontColorFirmGreen)" iconName={IconName.User} />
              </span>
              <span className={getUnitedClassnames(["singleLine", classes.userPopup__userNameText])}>{user}</span>
            </div>
          )}
          <SausageButton
            text={intl(user ? "exitButton" : "enterButton")}
            iconName={IconName.Logout}
            isFetching={isLoading || isLogoutLoading}
            onClick={() => onUserButtonClick(user, router, pathname, logout, setPopupOpen)}
            size={UiSize.Small}
          />
          <div className={classes.userPopup__langBlock}>
            <span className={getUnitedClassnames(["singleLine", classes.userPopup__userNameText])}>
              {intl("language")}
            </span>
            <RadioList
              name="language-list"
              options={languageOptions}
              selectedValue={locale}
              onChange={(newLocale) => onLangSelect(newLocale, router, pathname, searchParams)}
            />
          </div>
        </div>
      )}
      {!!errorMessage && <Modal modalType={ModalType.Info} header={errorMessage} onClose={() => setErrorMessage("")} />}
    </div>
  );
}
