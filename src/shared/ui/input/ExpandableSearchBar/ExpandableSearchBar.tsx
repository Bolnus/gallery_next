"use client";
import React from "react";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { IconName } from "../../icons/ReactIcon/types";
import { getUnitedClassnames, onInputChange, resetScrollOnBlur } from "../../../lib/common/commonUtils";
import classes from "./ExpandableSearchBar.module.scss";
import { UiSize } from "../../../lib/common/commonTypes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function setFocus(inputRef: React.RefObject<HTMLInputElement | null>) {
  inputRef.current?.focus();
  inputRef.current?.click();
}

function applySearch(onSearch: (str: string) => void, searchValue: string): string {
  if (searchValue) {
    onSearch(searchValue);
  }
  return "";
}

function invertSearchActive(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onSearch: (str: string) => void,
  setSearchActive: (flag: boolean) => void,
  prevSearchValue: string
): string {
  if (!prevSearchValue) {
    setSearchActive(true);
    inputRef.current?.focus();
    inputRef.current?.click();
    setTimeout(setFocus.bind(null, inputRef), 550);
  } else {
    applySearch(onSearch, prevSearchValue);
  }
  return "";
}

function onSearchClick(
  inputRef: React.RefObject<HTMLInputElement | null>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  setSearchName: (str: string) => void,
  onSearch: (flag: boolean) => void
) {
  setSearchValue(invertSearchActive.bind(null, inputRef, setSearchName, onSearch));
}

function onKeyUp(
  onSearch: (str: string) => void,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  localEvent: React.KeyboardEvent<HTMLInputElement>
) {
  if (localEvent.key === "Enter") {
    const { currentTarget } = localEvent;
    currentTarget.blur();
    setSearchValue(applySearch.bind(null, onSearch, currentTarget.value));
  }
}

function onBlur(setSearchActive: (flag: boolean) => void) {
  setSearchActive(false);
  resetScrollOnBlur();
}

interface Props {
  onSearch: (str: string) => void;
}

export function ExpandableSearchBar({ onSearch }: Props) {
  const [searchActive, setSearchActive] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
          onKeyUp={onKeyUp.bind(null, onSearch, setSearchValue)}
          ref={inputRef}
        />
        <div>
          <ButtonIcon
            iconName={IconName.Search}
            onClick={onSearchClick.bind(null, inputRef, setSearchValue, onSearch, setSearchActive)}
            size={UiSize.SmallAdaptive}
            color={searchActive ? "var(--inputBgColor)" : "white"}
            disabled={searchActive && !searchValue}
          />
        </div>
      </div>
    </div>
  );
}
