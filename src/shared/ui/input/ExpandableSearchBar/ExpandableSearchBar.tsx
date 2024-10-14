"use client";
import React from "react";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { IconName } from "../../icons/ReactIcon/types";
import { getUnitedClassnames, onInputChange, resetScrollOnBlur } from "../../../lib/common/commonUtils";
import classes from "./ExpandableSearchBar.module.scss";
import { UiSize } from "../../../lib/common/commonTypes";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAppDispatch } from "../../../../appFSD/lib/redux/reduxStore";
import { StoreProvider } from "../../../../appFSD/lib/redux/StoreProvider";
import { useSearchName } from "../../../lib/hooks/useSearchName";

function setFocus(inputRef: React.RefObject<HTMLInputElement | null>) {
  inputRef.current?.focus();
  inputRef.current?.click();
}

function applySearch(setSearchName: (str: string) => void, router: AppRouterInstance, searchValue: string): string {
  if (searchValue) {
    router.push(`/search?name=${searchValue}`);
    setSearchName(searchValue);
  }
  return "";
}

function invertSearchActive(
  inputRef: React.RefObject<HTMLInputElement | null>,
  setSearchName: (str: string) => void,
  router: AppRouterInstance,
  setSearchActive: (flag: boolean) => void,
  prevSearchValue: string
): string {
  if (!prevSearchValue) {
    setSearchActive(true);
    inputRef.current?.focus();
    inputRef.current?.click();
    setTimeout(setFocus.bind(null, inputRef), 550);
  } else {
    applySearch(setSearchName, router, prevSearchValue);
  }
  return "";
}

function onSearchClick(
  inputRef: React.RefObject<HTMLInputElement | null>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  setSearchName: (str: string) => void,
  router: AppRouterInstance,
  setSearchActive: (flag: boolean) => void
) {
  setSearchValue(invertSearchActive.bind(null, inputRef, setSearchName, router, setSearchActive));
}

function onKeyUp(
  router: AppRouterInstance,
  setSearchName: (str: string) => void,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  localEvent: React.KeyboardEvent<HTMLInputElement>
) {
  if (localEvent.key === "Enter") {
    const { currentTarget } = localEvent;
    currentTarget.blur();
    setSearchValue(applySearch.bind(null, setSearchName, router, currentTarget.value));
  }
}

function onBlur(setSearchActive: (flag: boolean) => void) {
  setSearchActive(false);
  resetScrollOnBlur();
}

function ExpandableSearchBarInternal() {
  const router = useRouter();
  const [searchActive, setSearchActive] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [, setSearchName] = useSearchName();

  return (
    <div className={classes.searchBarContainer}>
      <div
        className={getUnitedClassnames([
          classes.searchBar,
          searchActive ? classes.searchBar_expanded : classes.searchBar_collapsed
        ])}
      >
        <input
          className={getUnitedClassnames([
            "commonInput",
            classes.searchBar__input,
            searchActive ? classes.searchBar__input_expanded : classes.searchBar__input_collapsed
          ])}
          value={searchValue}
          onChange={onInputChange.bind(null, setSearchValue)}
          onBlur={onBlur.bind(null, setSearchActive)}
          onKeyUp={onKeyUp.bind(null, router, setSearchName, setSearchValue)}
          ref={inputRef}
        />
        <div>
          <ButtonIcon
            iconName={IconName.Search}
            onClick={onSearchClick.bind(null, inputRef, setSearchValue, setSearchName, router, setSearchActive)}
            size={UiSize.SmallAdaptive}
            color={searchActive ? "var(--inputBgColor)" : "white"}
            disabled={searchActive && !searchValue}
          />
        </div>
      </div>
    </div>
  );
}

export function ExpandableSearchBar(): JSX.Element {
  return (
    <StoreProvider>
      <ExpandableSearchBarInternal />
    </StoreProvider>
  );
}
