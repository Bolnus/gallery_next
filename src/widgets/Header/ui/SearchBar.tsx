"use client";
import React from "react";
import { useRouter } from "next/navigation";
import classes from "./header.module.scss";
import { ExpandableSearchBar } from "../../../shared/ui/input/ExpandableSearchBar/ExpandableSearchBar";
import { useSearchName } from "../../../appFSD/lib/context/useSearchName";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function onSearch(setSearchName: (str: string) => void, router: AppRouterInstance, searchValue: string): void {
  router.push(`/search?name=${searchValue}`);
  setSearchName(searchValue);
}

export function SearchBar(): JSX.Element {
  const router = useRouter();
  const [, setSearchName] = useSearchName();
  return (
    <div className={`${classes.searchBar}`}>
      <ExpandableSearchBar onSearch={onSearch.bind(null, setSearchName, router)} />
    </div>
  );
}
