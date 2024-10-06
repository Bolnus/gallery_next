"use client";
import React from "react";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { IconName } from "../../icons/ReactIcon/types";
import { getUnitedClassnames, onInputChange, resetScrollOnBlur } from "../../../lib/common/commonUtils";
import classes from "./ExpandableSearchBar.module.scss";
import { UiSize } from "../../../lib/common/commonTypes";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function invertFlag(flag: boolean): boolean {
  return !flag;
}

function onSearchClick(setSearchActive: React.Dispatch<React.SetStateAction<boolean>>) {
  setSearchActive(invertFlag);
}

function onKeyUp(router: AppRouterInstance, localEvent: React.KeyboardEvent<HTMLInputElement>) {
  if (localEvent.key === "Enter") {
    const { currentTarget } = localEvent;
    currentTarget.blur();
    // onBlur(setSearchValue, setSearchActive);
    router.push(`/search?name=${currentTarget.value}`);
  }
}

function onBlur(setSearchValue: (newStr: string) => void, setSearchActive: (flag: boolean) => void) {
  setSearchValue("");
  setSearchActive(false);
  resetScrollOnBlur();
}

export function ExpandableSearchBar() {
  const router = useRouter();
  const [searchActive, setSearchActive] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

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
          onBlur={onBlur.bind(null, setSearchValue, setSearchActive)}
          onKeyUp={onKeyUp.bind(null, router)}
        />
        <div>
          <ButtonIcon
            iconName={IconName.Search}
            onClick={onSearchClick.bind(null, setSearchActive)}
            size={UiSize.Large}
            color={searchActive ? "var(--inputBgColor)" : "white"}
          />
        </div>
      </div>
    </div>
  );
}
