"use client";
import React from "react";
import { SearchContext } from "./searchContext";

export function useSearchName(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const { searchName } = React.useContext(SearchContext);
  return searchName;
}
