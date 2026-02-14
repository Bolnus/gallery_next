import React from "react";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import classes from "./CategoryHeader.module.scss";

interface Props {
  category: string;
  isFetching?: boolean;
}

export function CategoryHeader({ category }: Readonly<Props>): JSX.Element {
  return <h1 className={getUnitedClassnames([classes.categoryHeader, classes.categoryHeader_spacing])}>{category}</h1>;
}
