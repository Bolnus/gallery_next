"use client";
import React from "react";
import { SearchContext } from "./searchContext";

export function useSearchName() {
  const { searchName } = React.useContext(SearchContext);
  return searchName;
}
