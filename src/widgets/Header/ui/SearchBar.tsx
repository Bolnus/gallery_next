"use client";
import React from "react";
import classes from "./header.module.scss";
import { ExpandableSearchBar } from "../../../shared/ui/input/ExpandableSearchBar/ExpandableSearchBar";

export function SearchBar(): JSX.Element {
  return (
    <div className={`${classes.searchBar}`}>
      <ExpandableSearchBar />
    </div>
  );
}
