import React from "react";
import { SkeletonLoader } from "../../icons/SkeletonLoader/SkeletonLoader";
import classes from "./LoadingText.module.scss";

export function LoadingText(): JSX.Element {
  return (
    <div className={classes.loadingTextContainer}>
      <SkeletonLoader />
    </div>
  );
}
